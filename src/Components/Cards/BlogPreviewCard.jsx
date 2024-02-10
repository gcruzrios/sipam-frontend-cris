import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

export const BlogPreviewCard = ({title, text, imageSrc, id, handleBtnClick}) => {
    return(
        <div className="card card-blog-preview d-flex">
            <div className="row g-0 flex-fill">
                {imageSrc && (
                <div className="col-md-4">
                    <img src={imageSrc} className="img-fluid rounded-start h-100 w-100" alt="..." />
                </div>)}
                <div className="col">
                    <div className="card-body d-flex flex-column">
                        <h5 className="card-title fw-bold text-primary">{title}</h5>
                        <p className="card-text">{text}</p>
                        <button type="button" onClick={() => handleBtnClick(id)} className="btn btn-outline-primary px3 ms-auto">Ver artículo</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

BlogPreviewCard.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
    imageSrc: PropTypes.string,
    id: PropTypes.string,
    handleBtnClick: PropTypes.func
};

