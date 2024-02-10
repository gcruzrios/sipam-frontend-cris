import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useApi from '../../App/hooks/useApi';
import { getBlogById } from '@/server/api';
import CommonLayout from '../../Containers/CommonLayout';

const BlogPreviewPage = () => {
    const loaded = useRef(false);
    const [blog, setBlog] = useState(null);
    const { blogId } = useParams();
    const api = useApi();

    useEffect(() => {
        async function fetch() {
            const fetchBlog = await api.request(getBlogById, blogId);
            setBlog(fetchBlog);
        }
        if (!loaded.current) {
            fetch();
            loaded.current = true;
        }
    }, [api, blog, blogId]);

    return (
        <CommonLayout>
            <div className="blog-preview-page p-4">
                {blog && blog.content &&
                    (<div dangerouslySetInnerHTML={{ __html: blog.content }}>

                    </div>)}
            </div>
        </CommonLayout>
        );
};

export default BlogPreviewPage;