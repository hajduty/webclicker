using backend;
using backend.Services;
using backend.Services.TcpServerApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using System;
using System.Configuration;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var key = Encoding.ASCII.GetBytes("maG>o)pNwcQ[GM?~)!G.@a)`x;HHH(999"); // Replace with your actual secret key
var tcpHost = "0.0.0.0";
int tcpPort = int.TryParse(Environment.GetEnvironmentVariable("TCP_PORT"), out int result) ? result : 4402;

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite("Data Source=sample.db"));
builder.Services.AddSingleton<TokenService>(new TokenService("maG>o)pNwcQ[GM?~)!G.@a)`x;HHH(999"));
builder.Services.AddScoped<ConfigService>();

// Register the singleton service with a factory method
builder.Services.AddSingleton<TcpServer>(sp => new TcpServer(tcpHost, tcpPort, sp));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

var tcpServer = app.Services.GetRequiredService<TcpServer>();
tcpServer.Start();

app.Run();
