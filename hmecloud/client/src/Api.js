import {Config} from './Config'

class Api {
  postData (url, data, callback) {
    fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'x-access-token': Config.token
    },
    body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((data) => {
        this.state.successMessage = data.data
        this.state.errorMessage = ''
        this.state.saveSuccess = true
        this.setState(this.state)
        this.getAvailableGroupStoreList()
    })
    .catch((error) => {
        this.state.successMessage = ''
        this.state.errorMessage = error.message
        this.setState(this.state)
    })
  }
  getData (url, callback) {
    fetch(url,{
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Config.token
        }
    })
    .then((response) => response.json())
    .then(callback)
    .catch((error) => {
      console.log(error)
    })
  }
  deleteData (url, callback) {
    fetch(url,{
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Config.token
      }
    })
    .then((response) => response.json())
    .then(callback)
    .catch((error) => {
      console.log(error)
    })
  }
}


 export default Api;
