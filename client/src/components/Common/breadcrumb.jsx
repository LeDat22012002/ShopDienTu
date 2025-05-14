import React, { memo } from 'react';
import useBreadcrumbs from 'use-react-router-breadcrumbs';
import { Link } from 'react-router-dom';
import icons from '../../ultils/icons';

const Breadcrumb = ({ title, category }) => {
    const { IoIosArrowForward } = icons;
    const routes = [
        { path: '/:category', breadcrumb: category },
        { path: '/', breadcrumb: 'Home' },
        { path: '/:category/:pid/:title', breadcrumb: title },
    ];

    const breadcrumb = useBreadcrumbs(routes);

    return (
        <div className="text-[12px] flex items-center gap-1 lg:text-sm">
            {breadcrumb
                ?.filter((el) => !el.match.route === false)
                .map(({ match, breadcrumb }, index, self) => (
                    <Link
                        className="flex items-center gap-1 hover:text-main"
                        key={match.pathname}
                        to={match.pathname}
                    >
                        <span className="capitalize"> {breadcrumb}</span>
                        <span className="mt-0.5">
                            {index !== self.length - 1 && <IoIosArrowForward />}
                        </span>
                    </Link>
                ))}
        </div>
    );
};

export default memo(Breadcrumb);
