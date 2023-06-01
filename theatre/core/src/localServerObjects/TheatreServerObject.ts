export interface IServerObjects {
    readonly type: 'Theatre_LocalServer_PublicAPI';

    serverAddress:string;
    updatedFile:any;
    updateListender:(obj?:any) => void;

    setServerAddress(str:string):void;
    setUpdatedFile:(obj?:any) => void;
    setUpdateListender:(func:(obj?:any) => void) => void;
}
  
export default class TheatreServerObject implements IServerObjects {
    
    serverAddress: string;
    updatedFile: any;
    updateListender: (obj?:any) => void;

    get type(): 'Theatre_LocalServer_PublicAPI' {
        return 'Theatre_LocalServer_PublicAPI'
    }

    constructor(str?:string) {
        this.serverAddress = str?str:'not set yet';
        this.updatedFile = null;
        this.updateListender = () => {}
    }
    
    setServerAddress(str: string) {
        this.serverAddress = str;
    }
    
    setUpdatedFile(obj?: any){
        this.updatedFile = obj;
    };

    setUpdateListender(obj: any) {
        this.updatedFile = obj; 
        this.updateListender(obj);
    }

}
  