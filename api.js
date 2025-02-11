import axios from "axios";

const api = {
  getData: () => {
    return fetch('http://localhost:3000/api/data')
      .then(response => response.json())
      .catch(error => console.error(error));
  },

  sendData: (data) => {
    return fetch('http://localhost:3000/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .catch(error => console.error(error));
  },
};

export default api;