import JSZip from 'jszip';
import axios from 'axios';
import { saveAs } from 'file-saver';


export const downloadZip = async (urls) => {


    const apiClient = axios.create({
        baseURL: '/docs'
    });

    const download = (item) => {
        //download single file as blob and add it to zip archive
        return apiClient.get(item.url, {responseType: 'blob'}).then((resp) => {
            zip.file(item.name, resp.data);
        });
    };

    const zip = new JSZip();

    const arrOfFiles = urls.map((item) => download(item)); //create array of promises

    Promise.all(arrOfFiles)
        .then(() => {
            //when all promises resolved - save zip file
            zip.generateAsync({type: 'blob'}).then(function (blob) {
                saveAs(blob, 'documentos.zip');
            });
        })
        .catch((err) => {
            console.log(err);
        });
};