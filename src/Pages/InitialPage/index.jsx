import React from 'react';
import bg from '../../assets/images/indexBackground.png';
import CommonLayout from '../../Containers/CommonLayout';
import {BlogPreviewCard} from '@/Components/Cards/BlogPreviewCard';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import InitialPageTable from '../../Components/Tables/InitialPageTable';
import Swal from 'sweetalert2';
import {When} from '@/utils/util';
import {ReviewingFilesCard} from '@/Components/Cards/ReviewingFilesCard';
import {
    getActionsOrgs,
    getActionsPam,
    mapOrganizationsTableRows,
    mapPamTableRows,
    organizationsTableColumns,
    pamTableColumns
} from '@/Components/Tables/model';
import {getUserRole} from '@/App/hooks/useAuth';
import {equals} from 'ramda';
import {ROLE_ADMIN} from '@/store/model';

const InitialPage = () => {
    const blog = useSelector(state => state?.initialPage?.blogPreview);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isRoleAdmin = React.useMemo(() => equals(getUserRole(),ROLE_ADMIN), []);
    const list =  isRoleAdmin  ? useSelector(state => state.root?.orgsList) : useSelector(state => state.initialPage?.listadoPam);

    const mapFunction = isRoleAdmin ? mapOrganizationsTableRows : mapPamTableRows;
    const tableRows = React.useMemo(() => list?.map(mapFunction) , [list]);

    const columns = isRoleAdmin ? organizationsTableColumns : pamTableColumns;

    return (
        <CommonLayout style={{backgroundImage: `url(${bg})`}}>
            <div className="container-fluid d-flex flex-fill flex-column align-items-center bg-semi-50 p-0 m-0">
                <div className="container-lg d-inline-flex mt-4 px-4 row justify-content-center m-0">
                    <div className="container d-flex col col-12 col-lg-6 p-3">
                        {blog &&
                            <BlogPreviewCard
                                title={blog.title}
                                text={blog.content_preview}
                                imageSrc={blog.image_preview}
                                id={blog.id}
                                handleBtnClick={(id) => navigate(`/blogPreview/${id}`)}
                            />}
                    </div>
                    <div className="d-flex col col-12 col-lg-6 p-3">
                        <ReviewingFilesCard/>
                    </div>
                </div>
                <When condition={!!tableRows}>
                    <div className="container-lg mt-auto">
                        <InitialPageTable
                            columns={columns}
                            data={tableRows}
                            enableSourceSelector={!isRoleAdmin}
                            title={isRoleAdmin ? 'Listado OBS / GL' : 'Listado PAM'}
                            getActionsFn={isRoleAdmin ? getActionsOrgs(navigate, dispatch) : getActionsPam(navigate, dispatch)}
                        />
                    </div>
                </When>

            </div>
        </CommonLayout>
    );
};

export default InitialPage;
