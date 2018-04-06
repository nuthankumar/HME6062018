import {config} from './config'

  class Api {

    postData(subPath,data,callback){
        let url = config.url + subPath;
        fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': ''
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
    getData(subPath,callback){
        let url = config.url + subPath 
        fetch(url,{
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': config.token
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