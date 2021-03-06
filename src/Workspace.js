var _fs_=require("fs");
var _path_ = require("path");

var CLASS = require("./CoreClass.js");
var Logger = require("./Logger.js")();

const APK = require("./APK.js");

const DIR_NAME = {
    SAVE: "save",
    IN: "inputs",
    RUNTIME: "runtime",
    RUNTIME_FILES: _path_.join("runtime","files"),
    RUNTIME_BC: _path_.join("runtime","bytecode"),
    LOGS: "logs",
    APPDATA: "appdata",
    TMP: "tmp",
    DEXES: "dexes",
    DEX: "apk" //"dex"
};

/**
 * Represents a project workspace. 
 * 
 * Dexcalibur glabal workspace contains one sub-workspace per project
 * 
 * It is used when the tool 
 * wants access/read/write files or folder. 
 *  
 * @param {string} pkg The application package name
 * @param {Object} config The  
 * @class 
 */
class Workspace{

    /**
     * 
     * @param {*} pPath 
     * @constructor
     */
    constructor ( pPath){

        /**
         * Working directory
         * @field
         */
        this.path = pPath;

        /**
         * @type {APK}
         * @field
         */
        this.mainAPK = new APK(
            _path_.join(this.path, 'app.apk')
        );
    }
    
    /**
     * To export a Workspace instance to a Stub.
     * It is used when Dexcalibur prepare the data to be save in a flat file.
     * @returns {Stub} The Stub containing the Workspace instance data. 
     * @method
     */
    _export(){
        return new CLASS.Stub(
            CLASS.STUB_TYPE.WORKSPACE,
            this
        );
    }

    /**
     * To import the given Stub instance into the current Workspace.
     * It is used when Dexcalibur want create a context from a save file.
     * @param {Stub} stub The Stub instance to import 
     * @method
     */
    _import(stub){
        for(let i in stub){
            if(this[i] !== undefined) this[i] = stub[i];
        }
    }

    /**
     * To create a directory into the application working directory.
     * @param {string} dirName The name of the directory to create
     * @method
     */
    mkWDir(pDirName){
        _fs_.mkdirSync(_path_.join(this.path, pDirName), {recursive: true});
    }

    /**
     * To remove the directory with the given name from the application working directory.
     * @param {string} dirName The name of the directory to remove 
     * @method
     */
    rmWDir(dirName, pAbsolutePath=false){
        if(pAbsolutePath == false){
            dirName = _path_.join( this.path, dirName);
        }

        if(_fs_.existsSync(dirName)){
            _fs_.readdirSync(dirName).forEach((file,i)=>{
                let p = _path_.join(dirName,file);
                if(_fs_.lstatSync(p).isDirectory()){
                    this.rmWDir(p, true);
                }else{
                    _fs_.unlinkSync(p);
                }
            });
            _fs_.rmdirSync(path);             
        }
    }


    /**
     * To verifry if the given path is writable. 
     * Its use absolute path.
     * @param {string} path Absolute file path to check
     * @returns {boolean} Returns TRUE if the file is writable, else FALSE
     * @method
     */
    isWritable(pPath){
        return _fs_.accessSync(pPath, _fs_.constants.F_OK | _fs_.constants.W_OK);
    };

    /**
     * To get the Application working directory
     * @returns {string} The Application worksing directory path
     * @method
     * @deprecated
     */
    getWD(){
        return this.path;
    }

    /**
     * To get the Application working directory
     * @returns {string} The Application worksing directory path
     * @method
     */
    getPath(){
        return this.path;
    }

    /*
     * To remove the current Application working directory
     * @returns {void} 
     * @function
     */
    /*
    clean(){
        this.rmWDir(this.getWD(), true);
        Logger.success("[*] Working directory removed : "+this.getWD());
    }*/

    /**
     * To initialize a new Application working directory. 
     * It creates a main folder and nested folders. 
     * If a folder already exists it will not be overwritten.
     * @method 
     */
    init(){
        if(!_fs_.existsSync(this.path)){
            _fs_.mkdirSync(this.path, {recursive: true});
        }    
        if(!_fs_.existsSync(_path_.join(this.path, DIR_NAME.SAVE))){
            this.mkWDir(DIR_NAME.SAVE);
        }    
        if(!_fs_.existsSync(_path_.join(this.path, DIR_NAME.IN))){
            this.mkWDir(DIR_NAME.IN);
        }    
        if(!_fs_.existsSync(_path_.join(this.path, DIR_NAME.RUNTIME))){
            this.mkWDir(DIR_NAME.RUNTIME);
        }
        if(!_fs_.existsSync(_path_.join(this.path, DIR_NAME.RUNTIME_BC))){
            this.mkWDir(DIR_NAME.RUNTIME_BC);
        }
        if(!_fs_.existsSync(_path_.join(this.path, DIR_NAME.RUNTIME_FILES))){
            this.mkWDir(DIR_NAME.RUNTIME_FILES);
        }
        if(!_fs_.existsSync(_path_.join(this.path, DIR_NAME.APPDATA))){
            this.mkWDir(DIR_NAME.APPDATA);
        }
        if(!_fs_.existsSync(_path_.join(this.path, DIR_NAME.TMP))){
            this.mkWDir(DIR_NAME.TMP);
        }
        if(!_fs_.existsSync(_path_.join(this.path, DIR_NAME.DEX))){
            this.mkWDir(DIR_NAME.DEX);
        }
        Logger.success("[*] Working directory : "+this.path);
    }

    /**
     * To generate a new timestamped save file path
     * @returns {string} The timestamped save file path
     * @method
     */
    getNewSavefilePath(){
        let d = new Date();
        return _path_.join(this.path, DIR_NAME.SAVE, "autosave."+d.getTime()+".ddb");
    }


    getSaveDir(){
        return _path_.join(this.path, DIR_NAME.SAVE);
    }

    getAppdataDir(){
        return _path_.join(this.path, DIR_NAME.APPDATA);
    }

    getInputDir(){
        return _path_.join(this.path, DIR_NAME.IN);
    }

    getRuntimeDir(){
        return _path_.join(this.path, DIR_NAME.RUNTIME);
    }

    getRuntimeFilesDir(){
        return _path_.join(this.path, DIR_NAME.RUNTIME_FILES);
    }

    getRuntimeBcDir(){
        return _path_.join(this.path, DIR_NAME.RUNTIME_BC);
    }

    getTmpDir(){
        return _path_.join(this.path, DIR_NAME.TMP);
    }


    /**
     * @method
     */
    getProjectCfgPath(){
        return _path_.join(this.path, 'project.json');
    }
    
    getApkDir(){

        return _path_.join(this.path, DIR_NAME.DEX);
    }

    getApkPath(){
        return this.mainAPK.getPath();
    }

    getApk(){
        return this.mainAPK;
    }

    setApk( pApk){
        this.mainAPK = pApk; //APK.fromJsonObject( Workspace.getMainApkPath(), pData); 
    }


    changeMainAPK( pPath){
        _fs_.copyFileSync( pPath, this.getApkPath());
        this.mainAPK = new APK( this.getApkPath());
    }

    /**
     * To generate a new timestamped file path
     * @param {string} prefix The string part before the timestamp
     * @param {string} suffix The string part after the timestamp
     * @returns {string} The timestamped save file path
     * @method
     */
    getTimestampedFilePath(prefix,suffix){
        let d = new Date();
        return _path_.join(this.path,DIR_NAME.SAVE,prefix+d.getTime()+suffix);
    }


}


module.exports = Workspace;
