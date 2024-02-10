import React from 'react';
import { FileUploadCard } from './FileUploadCard';
import PropTypes from 'prop-types';
import './styles.scss';

export const FileUploadCardList = ({pendingFileList}) => {
    const groupBy = (items, number) => items.reduce((result, item, index) => {
        if (index % number === 0) {
            result.push([item]);
        } else {
            result[result.length - 1].push(item);
        }
        return result;
    }, []);
    const items = groupBy(pendingFileList, 2);
    const carrouselItemDiv = (item, index) =>
        <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
            <div className="d-flex flex-row">
                <div className="col-6 px-2">
                    <FileUploadCard
                        fileName={item[0]?.fileName}
                        daysLeft={item[0]?.daysLeft}
                        handler={() => { console.log('item', item[0]); }} />
                </div>
                <div className="col-6 px-2">
                    {item[1] &&
                        (<FileUploadCard
                            fileName={item[1]?.fileName}
                            daysLeft={item[1]?.daysLeft}
                            handler={() => { console.log('item', item[1]); }} />)}
                </div>
            </div>
        </div>;
    const carrouselItems = items.map((item, index) => (
        carrouselItemDiv(item, index)
    ));
    return (
        <div className="card card-file-upload-list flex-fill">
            <h4 className="text-center mt-2 text-danger">DOCUMENTOS A ENTREGAR</h4>
            {
                items && items.length > 0 ? (
                    <div id="carouselExample" className="carousel slide">
                        <div className="carousel-inner px-5 pb-3">
                            {carrouselItems}
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                ) : (
                    <h5 className="p-4 text-center">No hay documentos pendientes por entregar.</h5>
                )
            }
            
        </div>
    );
};

FileUploadCardList.propTypes = {
    pendingFileList: PropTypes.array
};