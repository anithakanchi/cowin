// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import './index.css'

const apiStatusConstants = {
  INITIAL: 'initial',
  INPROGRESS: 'inprogress',
  SUCCESS: 'success',
  FAILURE: 'failure',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusConstants.INITIAL,
  }

  componentDidMount() {
    this.getDetails()
  }

  getDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.INPROGRESS})
    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(response)
    if (response.ok === true) {
      const VaccinationByDays = data.last_7_days_vaccination.map(eachData => ({
        dose1: eachData.dose_1,
        dose2: eachData.dose_2,
        vaccineDate: eachData.vaccine_date,
      }))

      const vaccinationAge = data.vaccination_by_age.map(eachData => ({
        age: eachData.age,
        count: eachData.count,
      }))

      const vaccinationGender = data.vaccination_by_gender.map(eachData => ({
        count: eachData.count,
        gender: eachData.gender,
      }))

      this.setState({
        VaccinationByDays,
        vaccinationAge,
        vaccinationGender,
        apiStatus: apiStatusConstants.SUCCESS,
      })
    }
    if (response.status === 401) {
      this.setState({
        apiStatus: apiStatusConstants.FAILURE,
      })
    }
  }

  renderFailureView = () => (
    <>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure"
      />
    </>
  )

  renderSuccessView = () => {
    const {VaccinationByDays, vaccinationAge, vaccinationGender} = this.state
    return (
      <div className="vaccination-results">
        <div className="card-container">
          <h1 className="name-type">Vaccination Coverage</h1>
          <VaccinationCoverage VaccinationByDays={VaccinationByDays} />
        </div>
        <div className="card-container">
          <h1 className="name-type">Vaccination by gender</h1>
          <VaccinationByGender vaccinationGender={vaccinationGender} />
        </div>
        <div className="card-container">
          <h1 className="name-type">Vaccination by age</h1>
          <VaccinationByAge vaccinationAge={vaccinationAge} />
        </div>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderVaccinationResults = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.SUCCESS:
        return this.renderSuccessView()
      case apiStatusConstants.FAILURE:
        return this.renderFailureView()
      case apiStatusConstants.INPROGRESS:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {apiStatus} = this.state
    console.log(apiStatus)

    return (
      <div className="bg-container">
        <div className="logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            className="logo"
            alt="website logo"
          />
          <p className="logo-name">co-WIN</p>
        </div>
        <h1 className="heading">coWIN Vaccination in India</h1>
        <div className="vaccination-container">
          {this.renderVaccinationResults()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
