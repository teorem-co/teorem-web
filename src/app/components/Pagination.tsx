import React from 'react';

interface IProps {
    itemsPerPage: number;
    totalItems: number | undefined;
    paginate: (number: number) => void;
    activePageClass: string;
    currPage: number;
    footerActiveClassName?: string;
}

const Pagination: React.FC<IProps> = ({
    itemsPerPage,
    totalItems,
    paginate,
    activePageClass,
    currPage,
    footerActiveClassName,
}) => {
    const pageNumbers = [];
    const pageNumbersNew = [];
    const totalPages = Math.ceil(totalItems! / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        //pagination array if number of pages are less or equal to 6
        pageNumbers.push(i);

        //pagination array if number of pages are more than 6
        //case 1 - first 3 pages (with dots on the right)
        if (currPage > 0 && currPage < 4) {
            if (i > 0 && i < 4) {
                pageNumbersNew.push(i);
            } else if (i === totalPages) {
                pageNumbersNew.push('...');
                pageNumbersNew.push(i);
            }
        }
        //case 2 - pages in the between
        if (currPage > 3 && currPage < totalPages - 2) {
            if (i >= currPage - 2 && i <= currPage) {
                pageNumbersNew.push(i);
            } else if (i === totalPages) {
                pageNumbersNew.push('...');
                pageNumbersNew.push(i);
            }
        }
        //case 3 - last 3 pages (with dots on the left)
        if (currPage >= totalPages - 2) {
            if (i === 1) {
                pageNumbersNew.push(i);
                pageNumbersNew.push('...');
            } else if (i >= totalPages - 2 && i <= totalPages) {
                pageNumbersNew.push(i);
            }
        }
    }

    const handleDots = () => {
        if (currPage < 3) {
            return paginate(4);
        }

        if (currPage > 2 && currPage < totalPages - 2) {
            return paginate(
                currPage > totalPages - 3 ? currPage - 1 : currPage + 1
            );
        }

        if (currPage > totalPages - 3) {
            return paginate(totalPages - 3);
        }
    };

    return (
        <>
            <div
                className={`pagination ${
                    footerActiveClassName ? footerActiveClassName : ''
                }`}
            >
                <div
                    onClick={() =>
                        currPage === 1 ? undefined : paginate(currPage - 1)
                    }
                    className={`pagination__arrow mr-1 ${
                        currPage === 1 ? 'disabled' : ''
                    }`}
                >
                    <i
                        className={`icon icon--chevron-left icon--base pagination__arrow__icon m--right-40`}
                    ></i>
                </div>
                {totalPages < 6
                    ? pageNumbers.map((n, index) => (
                          <div
                              className={`pagination__item cur--pointer ${
                                  n === currPage ? activePageClass : ''
                              }`}
                              onClick={() =>
                                  typeof n === 'string'
                                      ? undefined
                                      : paginate(n)
                              }
                              key={index}
                          >
                              {n}
                          </div>
                      ))
                    : pageNumbersNew.map((n, index) => (
                          <div
                              className={`pagination__item cur--pointer ${
                                  n === currPage ? activePageClass : ''
                              }`}
                              onClick={() =>
                                  typeof n === 'string'
                                      ? handleDots()
                                      : paginate(n)
                              }
                              key={index}
                          >
                              {n}
                          </div>
                      ))}
                <div
                    onClick={() =>
                        currPage === totalPages
                            ? undefined
                            : paginate(currPage + 1)
                    }
                    className={`pagination__arrow ml-1 ${
                        currPage === totalPages ? 'disabled' : ''
                    }`}
                >
                    <i
                        className={`icon icon--chevron-right icon--base pagination__arrow__icon m--left-40`}
                    ></i>
                </div>
            </div>
        </>
    );
};

export default Pagination;
