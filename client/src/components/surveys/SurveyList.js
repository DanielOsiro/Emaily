import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { connect } from "react-redux";
import { fetchSurveys } from "../../actions";

const SurveyList = (props) => {
  let { page } = useParams();
  const [currentPage, setCurrentPage] = useState(page ?? 1);

  useEffect(() => {
    props.fetchSurveys(currentPage);
  }, [currentPage]);

  const renderSurveys = () => {
    return (
      <>
        {props.surveys.data.map((survey, i) => {
          return (
            <div key={i} className="card blue-grey darken-1">
              <div className="card-content white-text">
                <span className="card-title">{survey.title}</span>
                <p>{survey.body}</p>
                <p className="right">
                  Sent on {new Date(survey.dateSent).toLocaleDateString()}
                </p>
              </div>
              <div className="card-action">
                <a>Yes: {survey.yes}</a>
                <a>No: {survey.no}</a>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  const renderPagination = (currentPage, totalPages) => {
    const nextPage = pageNum("up");
    const previousPage = pageNum("down");

    return (
      <>
        <p>
          Page: {currentPage} of {totalPages}
        </p>
        <p>
          <Link
            to={`/surveys/${previousPage.toString()}`}
            onClick={() => setCurrentPage(previousPage)}
            className="teal btn-flat white-text"
          >
            <i className="material-icons">chevron_left</i>
          </Link>

          <Link
            to={`/surveys/${nextPage.toString()}`}
            onClick={() => setCurrentPage(nextPage)}
            className="teal btn-flat white-text"
          >
            <i className="material-icons">chevron_right</i>
          </Link>
        </p>
      </>
    );
  };

  const pageNum = (direction) => {
    let page = currentPage;

    if (direction === "up") {
      page =
        page < props.surveys.totalPages ? ++page : props.surveys.totalPages;
    } else if (direction === "down") {
      page = page > 1 ? --page : 1;
    }

    return parseInt(page);
  };

  return (
    <div>
      {renderSurveys()}
      {renderPagination(currentPage, props.surveys.totalPages)}
    </div>
  );
};

const mapStateToProps = ({ surveys }) => {
  return { surveys };
};

export default connect(mapStateToProps, { fetchSurveys })(SurveyList);
