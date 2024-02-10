import React from 'react';
import PropTypes from 'prop-types';

const TablePaginationComponent = ({
                                      currentPage,
                                      lastPage,
                                      pageCount,
                                      pageSize,
                                      setPageSize,
                                      previousPage,
                                      gotoPage,
                                      nextPage,
                                      canPreviousPage,
                                      canNextPage,
                                      showCurrentPage
                                  }) => {

    return (
        <>
            {lastPage >= 1 && (
                <ul className="pagination">
                    <li className="page-item">
                        <button className="page-link" onClick={() => previousPage()}
                                disabled={!canPreviousPage}>{'Anterior'}</button>
                    </li>
                    <li className="page-item">
                        <button className={`page-link${currentPage === 1 ? ' active' : ''}`} onClick={() => gotoPage(0)}
                                disabled={!canPreviousPage}>1
                        </button>
                    </li>
                    {currentPage > 4 && (
                        <li className="page-item">
                            <button className="page-link" disabled>...</button>
                        </li>
                    )}
                    {(currentPage > 4 && currentPage > lastPage - 1) && (
                        <li className="page-item">
                            <button className="page-link"
                                    onClick={() => gotoPage(currentPage - 1)}>{currentPage - 6}</button>
                        </li>
                    )}
                    {(currentPage > 4 && currentPage > lastPage - 2) && (
                        <li className="page-item">
                            <button className="page-link"
                                    onClick={() => gotoPage(currentPage - 1)}>{currentPage - 5}</button>
                        </li>
                    )}
                    {(currentPage > 4 && currentPage > lastPage - 3) && (
                        <li className="page-item">
                            <button className="page-link"
                                    onClick={() => gotoPage(currentPage - 1)}>{currentPage - 4}</button>
                        </li>
                    )}
                    {(currentPage > 4 && currentPage > lastPage - 4) && (
                        <li className="page-item">
                            <button className="page-link"
                                    onClick={() => gotoPage(currentPage - 1)}>{currentPage - 3}</button>
                        </li>
                    )}
                    {currentPage > 3 && (
                        <li className="page-item">
                            <button className="page-link"
                                    onClick={() => gotoPage(currentPage - 1)}>{currentPage - 2}</button>
                        </li>
                    )}
                    {currentPage > 2 && (
                        <li className="page-item">
                            <button className="page-link" onClick={() => previousPage()}>{currentPage - 1}</button>
                        </li>
                    )}
                    {currentPage !== 1 && currentPage !== lastPage && (
                        <li className="page-item active">
                            <button className="page-link" disabled>{currentPage}</button>
                        </li>
                    )}
                    {currentPage < lastPage - 1 && (
                        <li className="page-item">
                            <button className="page-link" onClick={() => nextPage()}>{currentPage + 1}</button>
                        </li>
                    )}
                    {currentPage < lastPage - 2 && (
                        <li className="page-item">
                            <button className="page-link"
                                    onClick={() => gotoPage(currentPage + 1)}>{currentPage + 2}</button>
                        </li>
                    )}
                    {(currentPage === lastPage - 4 || currentPage < 5) && currentPage < lastPage - 4 && (
                        <li className="page-item">
                            <button className="page-link"
                                    onClick={() => gotoPage(currentPage + 2)}>{currentPage + 3}</button>
                        </li>
                    )}
                    {currentPage < lastPage - 4 && currentPage < 4 && (
                        <li className="page-item">
                            <button className="page-link"
                                    onClick={() => gotoPage(currentPage + 3)}>{currentPage + 4}</button>
                        </li>
                    )}
                    {currentPage < lastPage - 4 && currentPage < 3 && (
                        <li className="page-item">
                            <button className="page-link"
                                    onClick={() => gotoPage(currentPage + 4)}>{currentPage + 5}</button>
                        </li>
                    )}
                    {currentPage < lastPage - 4 && currentPage < 2 && (
                        <li className="page-item">
                            <button className="page-link"
                                    onClick={() => gotoPage(currentPage + 5)}>{currentPage + 6}</button>
                        </li>
                    )}
                    {currentPage < lastPage - 3 && (
                        <li className="page-item">
                            <button className="page-link" disabled>...</button>
                        </li>
                    )}
                    {lastPage > 1 && (
                        <li className="page-item">
                            <button className={`page-link${currentPage === pageCount ? ' active' : ''}`}
                                    onClick={() => gotoPage(pageCount - 1)}
                                    disabled={!canNextPage}>{lastPage}</button>
                        </li>
                    )}
                    <li className="page-item">
                        <button className="page-link" onClick={() => nextPage()}
                                disabled={!canNextPage}>{'Siguiente'}</button>
                    </li>
                    {showCurrentPage && (
                        <li className="page-item">
                                <span className="page-link">
                                    Pagina{' '}
                                    <strong>
                                        {currentPage} de {lastPage}
                                    </strong>{' '}
                                </span>
                        </li>
                    )}
                </ul>
            )}
            <ul className="pagination">
                <li className="page-item">
                    <select
                        className="form-control form-select page-link"
                        value={pageSize}
                        onChange={e => {
                            setPageSize(Number(e.target.value));
                        }}
                        style={{width: '120px', height: '38px'}}
                    >
                        {[5, 10, 25, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                </li>
            </ul>
        </>
    );
};

TablePaginationComponent.propTypes = {
    currentPage: PropTypes.number,
    lastPage: PropTypes.number,
    pageCount: PropTypes.number,
    pageSize: PropTypes.number,
    setPageSize: PropTypes.func,
    previousPage: PropTypes.func,
    gotoPage: PropTypes.func,
    nextPage: PropTypes.func,
    canPreviousPage: PropTypes.bool,
    canNextPage: PropTypes.bool,
    showCurrentPage: PropTypes.bool
};

export default TablePaginationComponent;