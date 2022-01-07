import MainWrapper from '../../components/MainWrapper';

const SearchTutors = () => {
    return (
        <MainWrapper>
            <div className="card--search">
                <div className="card--search__head">
                    <div className="type--lg type--wgt--bold">Tutor list</div>
                    <div>
                        <span>subjects</span>
                        <span>Level</span>
                        <span>All availability</span>
                        <span>Rest Filter</span>
                    </div>
                </div>
                <div className="card--search__body">
                    <div className="mb-10">
                        <span className="type--uppercase type--color--tertiary">
                            Tutor Available
                        </span>
                        <span className="tag--primary d--ib ml-2">105</span>
                    </div>
                    <div className="tutor-list">
                        <div className="tutor-list__item">
                            <div className="tutor-list__item__img">slika</div>
                            <div className="tutor-list__item__info">
                                <div className="type--md mb-1">Maria Diaz</div>
                                <div className="type--color--brand mb-4">
                                    Primary School Teacher
                                </div>
                                <div className="type--color--secondary mb-6 w--632--max">
                                    Keen and enthusiastic palaeontology student
                                    looking forward to helping you with any
                                    challenging topics in Biology and/or
                                    Geology!
                                </div>
                                <div>
                                    <span className="tag--primary">
                                        Geology
                                    </span>
                                    <span className="tag--primary">
                                        Biology
                                    </span>
                                </div>
                            </div>
                            <div className="tutor-list__item__details">
                                <div className="flex--grow">
                                    <div className="flex flex--center mb-3">
                                        <i className="icon icon--star icon--base icon--grey"></i>
                                        <span className="d--ib ml-4">
                                            4.9 rating
                                        </span>
                                    </div>
                                    <div className="flex flex--center">
                                        <i className="icon icon--completed-lessons icon--base icon--grey"></i>
                                        <span className="d--ib ml-4">
                                            15 completed lessions
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <button className="btn btn--primary btn--base w--100">
                                        View profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainWrapper>
    );
};

export default SearchTutors;
