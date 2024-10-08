import { Injectable } from '@angular/core';
import { UswagonAuthService } from 'uswagon-auth';
import { UswagonCoreService } from 'uswagon-core';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(private API:UswagonCoreService, private auth:UswagonAuthService) {}


  async getContentSetting(division?:string){
    var _division = division;

    if(_division == undefined){
      _division = this.auth.getUser().division_id;
    }

    const response = await this.API.read({
        selectors: ['*'],
        tables: 'contents',
        conditions: `WHERE division_id = '${_division}'`,
      });

      if(response.success){
        if(response.output.length > 0){
          const content = response.output[0];

          if(content.video){
            content.video = this.API.getFileURL(content.video);
          }
          if(content.background){
            content.background = this.API.getFileURL(content.background);
          }
          if(content.logo){
            content.logo = this.API.getFileURL(content.logo);
          }
          
          return content;
        }else{
          return null;
        }
      }else{
        throw new Error('Error getting content.');
      }
  }

  async getContentSettings(){

    const response = await this.API.read({
        selectors: ['*'],
        tables: 'contents',
        conditions: ``,
      });

      if(response.success){
        if(response.output.length > 0){
          return response.output[0];
        }else{
          return null;
        }
      }else{
        throw new Error('Error getting content.');
      }
  }

  async getDivisions(){
    const response = await this.API.read({
      selectors: ['*'],
      tables: 'divisions',
      conditions: ``,
    });

    if(response.success){
      return response.output;
    }else{
      throw new Error('Error getting divisions.');
    }
  }

  async updateContentSettings( settings: {selectedFiles: { [key: string]: File | null }, colors:{[key:string]:string}, widgets:{weather: boolean,time: boolean,currency: boolean,} , videoOption:string, videoUrl:string} ){
    const {selectedFiles,colors,widgets,videoOption,videoUrl} = settings
    
    const division_id = this.auth.getUser().division_id;
    // Process files for upload
    const uploadedFiles:{[key:string]:string} =  {};
    for(const variable in selectedFiles){
      // upload each file
      try{
        
        if(selectedFiles[variable] != null){
          const encryptedDivision = await this.API.encrypt(division_id);
          const cleanedDivision = encryptedDivision.replace(/[^a-zA-Z0-9]/g, '');
          const location =  `content/${encodeURIComponent(cleanedDivision)}/${selectedFiles[variable]!.name}`;
          await this.API.uploadFile(selectedFiles[variable]!, location);
          uploadedFiles[variable] = location;
        }
      }catch(e){
        for(const variable in uploadedFiles){
           await this.API.disposeFile(uploadedFiles[variable]!);
        }
        throw new Error('Error uploading files.');
      }
    }



    const response = await this.API.read({
      selectors: ['*'],
      tables: 'contents',
      conditions: `WHERE division_id = '${division_id}'`
    });

    if(response.success){
      if(response.output.length > 0){
        const url =  videoOption == 'url' ?  {video:videoUrl} : {};
        const updateResponse = await this.API.update({
          tables: 'contents',
          values: {
            ...colors,
            ...uploadedFiles,
            ...widgets,
            ...url
           
          },
          conditions: `WHERE division_id  = '${division_id}'`
        });
        if(!updateResponse.success){
          throw new Error('Something went wrong.');
        }
      }else{
        const id = this.API.createUniqueID32();
        const createResponse = await this.API.create({
          tables: 'contents',
          values: {
            id: id,
            'division_id': division_id,
            ...colors,
            ...uploadedFiles,
            ...widgets
            
          },
        });
        if(!createResponse.success){
          throw new Error('Something went wrong.');
        }
      }
    }else{
      throw new Error('Something went wrong.');
    }
  }

}
