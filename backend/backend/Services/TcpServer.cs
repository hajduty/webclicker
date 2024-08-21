using backend.Models;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Runtime.CompilerServices;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace backend.Services
{
    namespace TcpServerApi.Services
    {
        public class TcpServer
        {
            private TcpListener _listener;
            private readonly List<Tuple<TcpClient, string>> _clients = new();
            private readonly CancellationTokenSource _cancellationTokenSource = new();
            IServiceProvider _serviceProvider;
            string _host;
            int _port;

            public TcpServer(string ipAddress, int port, IServiceProvider serviceProvider)
            {
                _host = ipAddress;
                _port = port;
                _listener = new TcpListener(IPAddress.Parse(ipAddress), port);
                _serviceProvider = serviceProvider;
            }

            public void Start()
            {
                _listener.Start();
                Console.WriteLine("TCP Server started on " + _host + ":" + _port);
                Task.Run(async () => await AcceptClientsAsync());
                Task.Run(() => CleanUpInactiveClientsAsync(_cancellationTokenSource.Token));
            }

            public void Stop()
            {
                _cancellationTokenSource.Cancel();
                _listener.Stop();
                foreach (var client in _clients)
                {
                    client.Item1.Close();
                }
                _clients.Clear();
                Console.WriteLine("TCP Server stopped.");
            }

            public async Task SendToClientsAsync(string message)
            {
                var buffer = Encoding.UTF8.GetBytes(message);

                foreach (var clientTuple in _clients.ToList())
                {
                    var client = clientTuple.Item1;
                    if (client.Connected)
                    {
                        var stream = client.GetStream();
                        await stream.WriteAsync(buffer, 0, buffer.Length);
                    }
                }
            }

            public async Task SendToClientAsync(object message, TcpClient client)
            {
                var jsonMessage = JsonSerializer.Serialize(message);
                var buffer = Encoding.UTF8.GetBytes(jsonMessage);

                if (client.Connected)
                {
                    Console.WriteLine("Sent message");
                    var stream = client.GetStream();
                    await stream.WriteAsync(buffer, 0, buffer.Length);
                }
            }

            private async Task AcceptClientsAsync()
            {
                while (true)
                {
                    var client = await _listener.AcceptTcpClientAsync();
                    _clients.Add(Tuple.Create(client, string.Empty));
                    Console.WriteLine("Client connected.");
                    _ = Task.Run(() => HandleClientAsync(client));
                    _ = Task.Run(() => SendHeartbeatAsync(client, _cancellationTokenSource.Token));
                    _ = Task.Run(() => CleanUpInactiveClientsAsync(_cancellationTokenSource.Token));
                }
            }

            private async Task HandleClientAsync(TcpClient client)
            {
                var buffer = new byte[2048];
                var stream = client.GetStream();
                var hwd = "";

                while (client.Connected)
                {
                    int bytesRead = await stream.ReadAsync(buffer, 0, buffer.Length);
                    if (bytesRead > 0)
                    {
                        var message = Encoding.UTF8.GetString(buffer, 0, bytesRead);
                        Console.WriteLine($"Received: {message}");

                        TcpRequest? request;
                        try
                        {
                            request = JsonSerializer.Deserialize<TcpRequest>(message);
                        }
                        catch (JsonException)
                        {
                            Console.WriteLine("Invalid JSON format.");
                            client.Close();
                            continue;
                        }

                        if (request == null)
                        {
                            Console.WriteLine("Deserialized request is null.");
                            continue;
                        }
                        var clientTuple = _clients.FirstOrDefault(t => t.Item1 == client);

                        switch (request.Type)
                        {
                            case "sendhwid":
                                if (clientTuple != null)
                                {
                                    UpdateClientHwid(client, request.Contents.ToString());
                                }
                                Console.WriteLine("Added client " + request.Contents + " ::: count = " + _clients.Count);
                                hwd = request.Contents.ToString();
                                break;
                            case "quit":
                                _clients.RemoveAll(t => t.Item1 == client);
                                client.Close();
                                Console.WriteLine("Client disconnected.");
                                break;
                            case "getConfig":
                                var hwid = _clients.FirstOrDefault(t => t.Item1 == client)?.Item2;

                                if (hwid != null)
                                {
                                    using (var scope = _serviceProvider.CreateScope())
                                    {
                                        var configService = scope.ServiceProvider.GetRequiredService<ConfigService>();
                                        Console.WriteLine("Attempting to get config..");
                                        await SendToClientAsync(configService.GetUserConfig(hwid), client);
                                    }
                                }
                                break;
                            default:
                                if (clientTuple == null)
                                {
                                    Console.WriteLine("Error, clienttuple null!");
                                    break;
                                }

                                VarRequest req = new VarRequest { _key = request.Type, _value = request.Contents.ToString() };

                                using (var scope = _serviceProvider.CreateScope())
                                {
                                    var configService = scope.ServiceProvider.GetRequiredService<ConfigService>();
                                    Console.WriteLine("Attempting to update " + request.Type + " from client to server");
                                    configService.UpdateConfigProperty(clientTuple.Item2, req);
                                }
                                break;
                        }
                    }
                }
            }

            private async Task CleanUpInactiveClientsAsync(CancellationToken cancellationToken)
            {
                while (!cancellationToken.IsCancellationRequested)
                {
                    foreach (var clientTuple in _clients.ToList())
                    {
                        var client = clientTuple.Item1;
                        if (!client.Connected)
                        {
                            _clients.Remove(clientTuple);
                            client.Close();
                            Console.WriteLine("Removed inactive client : " + clientTuple.Item2);
                        }
                    }
                    await Task.Delay(TimeSpan.FromSeconds(10), cancellationToken); // Check every 10 seconds
                }
            }

            public async Task SendVarUpdate(string HWID, VarRequest vars)
            {
                var clientsWithHwid = _clients.Where(t => t.Item2 == HWID).Select(t => t.Item1).ToList();

                foreach (var client in clientsWithHwid)
                {
                    Console.WriteLine("Sending var to client with HWID " + HWID);
                    await SendToClientAsync(vars, client);
                }
            }

            private async Task SendHeartbeatAsync(TcpClient client, CancellationToken cancellationToken)
            {
                var heartbeatObject = new { message = "heartbeat" };
                string heartbeatMessage = JsonSerializer.Serialize(heartbeatObject);
                var buffer = Encoding.UTF8.GetBytes(heartbeatMessage);

                while (!cancellationToken.IsCancellationRequested && client.Connected)
                {
                    try
                    {
                        var stream = client.GetStream();
                        await stream.WriteAsync(buffer, 0, buffer.Length, cancellationToken);
                        await Task.Delay(TimeSpan.FromSeconds(60), cancellationToken);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error sending heartbeat: {ex.Message}");
                        break;
                    }
                }
                Console.WriteLine(client.Connected);
            }

            public bool UserOnline(string hwid)
            {
                foreach (var client in _clients)
                {
                    Console.WriteLine(client.Item2);
                }

                return _clients.Any(client => client.Item2 == hwid);
            }

            public void UpdateClientHwid(TcpClient client, string newHwid)
            {
                int index = _clients.FindIndex(t => t.Item1 == client);

                if (index != -1)
                {
                    var updatedTuple = new Tuple<TcpClient, string>(client, newHwid);

                    _clients[index] = updatedTuple;
                }
                else
                {
                    Console.WriteLine("Client not found in the list.");
                }
            }
        }
    }
}