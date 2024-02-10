import React from 'react';
import {FlatButton} from './FlatButton';
import {IfElse, randomUID} from '@/utils/util';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {IconButton} from '@mui/material';
import PropTypes from 'prop-types';

export const ChooseFileButton = ({label, fileLoaded, setFileLoaded}) => {
    const ref = React.useRef();
    const uuid = randomUID();
    const onChangeListener = (args) => {
        setFileLoaded(args.target.files[0]);
    };
    const onClickListener = () => {
        ref.current?.click();
    };
    const onRemoveListener = () => {
        setFileLoaded(undefined);
    };
    return (
        <>
            <input type="file"
                   ref={ref}
                   className="form-control"
                   id={uuid}
                   hidden={true}
                   accept="application/pdf"
                   onChange={onChangeListener}/>
            <IfElse condition={!fileLoaded} then={(
                <FlatButton btnStyle={'primary'}
                            label={label}
                            size={'sm'}
                            onclick={onClickListener}
                            className={'w-100'}

                />
            )}>
                <div className="d-flex flex-row justify-content-between rounded-1 flex-row px-0 bg-primary text-light fs-6 ">
                    <span className="d-flex align-items-center text-wrap"><AttachFileIcon fontSize="small"/>{fileLoaded?.name}</span>
                    <div >
                        <IconButton aria-label="editar"
                                    size="small"
                                    className="text-light"
                                    onClick={onClickListener}>
                            <EditIcon fontSize="medium"/>
                        </IconButton>
                        <IconButton aria-label="borrar"
                                    size="small"
                                    className="text-light"
                                    onClick={onRemoveListener}>
                            <DeleteForeverIcon fontSize="medium"/>
                        </IconButton>
                    </div>
                </div>

            </IfElse>

        </>
    );
};

ChooseFileButton.propTypes = {
    handleFileChange: PropTypes.func,
    label: PropTypes.string,
    fileLoaded: PropTypes.object,
    setFileLoaded: PropTypes.func,
};