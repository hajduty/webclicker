import axios from "axios";
import toast from "react-hot-toast";

export interface Request {
    _key: any;
    _value: any;
}

export interface StatusResponse {
    isOnline: boolean;
    isAuthorized: boolean;
}

export function setJwt(jwt: string | null) {
    axios.defaults.headers!.common['Authorization'] = `Bearer ${jwt}`;
}

export const updateKey = async (request: Request) => {
    try {
        await axios.post(API_URL+"/Tcp/var", request);
        await axios.post(API_URL+"/Config/updateConfig", request);  
    } catch(error) {
        toast.error("Something went wrong!");
        return;
    }

    toast.success("Updated " + request._key + " to " + request._value!,
        {
          style: {
            borderRadius: '10px',
            background: '#0a0a0a',
            color: '#fff',
            borderWidth: '1px',
            borderColor: '#ffffff15',
          },
        }
    );
}

export const setConfig = async (request: any) => {
    try {
        await axios.post(API_URL + "/Config/setConfig", request, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error setting config:', error);
        return;
    }

    toast("New config loaded, make sure to restart client!",
        {
          style: {
            borderRadius: '10px',
            background: '#0a0a0a',
            color: '#fff',
            borderWidth: '1px',
            borderColor: '#ffffff15',
          },
        }
    );
};

export const updateKeyOnly = async (request: Request) => {
    try {
        await axios.post(API_URL+"/Tcp/var", request);
    } catch(error) {
        toast.error("Error sending to client ",
            {
              style: {
                borderRadius: '10px',
                background: '#0a0a0a',
                color: '#fff',
                borderWidth: '1px',
                borderColor: '#ffffff15',
              },
            }
          );
        return;
    }

    toast("Sent to client " + request._key + " to " + request._value!,
        {
          icon: '👏',
          style: {
            borderRadius: '10px',
            background: '#0a0a0a',
            color: '#fff',
            borderWidth: '1px',
            borderColor: '#ffffff15',
          },
        }
      );
}

export const getConfig = async (): Promise<any> => {
    const response = await axios.get<any>(API_URL+'/Config/getConfig');
    return response.data;
}

export const getStatus = async (): Promise<StatusResponse> => {
    const response = await axios.post<any>(API_URL+'/Tcp/status');
    //console.log(response);
    return response.data;
}

export const updateHwid = async (req: Request) => {
    try {
        const response = await axios.post(API_URL+"/Auth/updateHwid", req);
        //console.log(req);
        //console.log(response);
        return response;
    } catch(error) {
        //console.log(error);
    }
}

export const API_URL = "https://localhost:7231"