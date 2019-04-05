import decode from 'jwt-decode';

export default class AuthService {
    // Initializing important variables
    constructor(domain) {
        this.domain = domain || 'https://exireum.homearan.com/api'; // API server domain
        this.fetch = this.fetch.bind(this); // React binding stuff
        this.login = this.login.bind(this);
        this.getProfile = this.getProfile.bind(this);
        this.setProfile = this.setProfile.bind(this);
    }


    getDomain() {
        return this.domain;
    }

    login(mobile, password) {
        // Get a token from api server using the fetch api
        return this.fetch(`${this.domain}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({mobile, password}),
        }).then((res) => {
            console.log(res);
            this.setToken(res.access_token); // Setting the token in localStorage
            return Promise.resolve(res);
        });
    }

    convertXirToIrr(amount) {

        return this.fetch(`${this.domain}/user/convert?type=deposit&amount=` + amount, {
            method: 'GET'
        })
            .then((res) => {
                // console.log(res);

                return Promise.resolve(res);
            });
    }

    convertIrrToXir(amount) {

        return this.fetch(`${this.domain}/user/convert?type=withdraw&amount=` + amount, {
            method: 'GET'
        })
            .then((res) => {
                // console.log(res);

                return Promise.resolve(res);
            });
    }

    convertXirToXlm(amount) {

        return this.fetch(`${this.domain}/user/convert?type=XIRTOXLM&amount=` + amount, {
            method: 'GET'
        })
            .then((res) => {
                // console.log(res);

                return Promise.resolve(res);
            });
    }

    convertIrrToXlm(amount) {

        return this.fetch(`${this.domain}/user/convert?type=IRRTOXLM&amount=` + amount, {
            method: 'GET'
        })
            .then((res) => {
                // console.log(res);

                return Promise.resolve(res);
            });
    }

    convertXlmToIrr(amount) {

        return this.fetch(`${this.domain}/user/convert?type=XLMTOIRR&amount=` + amount, {
            method: 'GET'
        })
            .then((res) => {
                // console.log(res);

                return Promise.resolve(res);
            });
    }

    register(username, email, first_name, last_name, national_number, address, mobile) {
        // Get a token from api server using the fetch api
        return this.fetch(`${this.domain}/auth/register`, {
            method: 'POST',
            body: JSON.stringify({username, email, first_name, last_name, national_number, address, mobile}),
        })
            .then((res) => {
                // console.log(res);
                // Setting the token in localStorage
                return Promise.resolve(res);
            });
    }


    sms(temporary_code) {
        // Get a token from api server using the fetch api
        var mobile = window.localStorage.getItem('mobile');
        return this.fetch(`${this.domain}/auth/verify`, {
            method: 'POST',
            body: JSON.stringify({temporary_code, mobile}),
        })
            .then((res) => {
                this.setToken(res.token);
                //console.log(res);
                // Setting the token in localStorage
                return Promise.resolve(res);
            });
    }

    resend() {
        // Get a token from api server using the fetch api
        var mobile = window.localStorage.getItem('mobile');
        console.log(mobile);
        return this.fetch(`${this.domain}/auth/resend`, {
            method: 'POST',
            body: JSON.stringify({mobile}),
        })
            .then((res) => {
                this.setToken(res.token);
                //console.log(res);
                // Setting the token in localStorage
                return Promise.resolve(res);
            });
    }

    setpassword(password, password_confirmation) {
        // Get a token from api server using the fetch api
        var token = this.getToken();
        return this.fetch(`${this.domain}/auth/password`, {
            method: 'POST',
            body: JSON.stringify({password, password_confirmation}),
        })
            .then((res) => {
                // console.log(res);
                // Setting the token in localStorage
                return Promise.resolve(res);
            });
    }

    Deposit(amount) {
        // Get a token from api server using the fetch api
        var public_key = window.localStorage.getItem('public_key');
        return this.fetch(`${this.domain}/user/deposit`, {
            method: 'POST',
            body: JSON.stringify({amount, public_key}),
        })
            .then((res) => {
                // console.log(res);
                // Setting the token in localStorage
                return Promise.resolve(res);
            });
    }

    DepositAcceptAsset() {
        // Get a token from api server using the fetch api
        var public_key = window.localStorage.getItem('public_key');
        return this.fetch(`${this.domain}/user/stellar/asset/accept`, {
            method: 'POST',
            body: JSON.stringify({public_key}),
        })
            .then((res) => {
                // console.log(res);
                // Setting the token in localStorage
                return Promise.resolve(res);
            });
    }

    Withdrawed(amount, sheba) {
        // Get a token from api server using the fetch api
        var public_key = window.localStorage.getItem('public_key');
        return this.fetch(`${this.domain}/user/stellar/withdraw`, {
            method: 'POST',
            body: JSON.stringify({amount, public_key, sheba}),
        })
            .then((res) => {
                // console.log(res);
                // Setting the token in localStorage
                return Promise.resolve(res);
            });
    }

    loggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken(); // GEtting token from localstorage
        return !!token && !this.isTokenExpired(token); // handwaiving here
    }

    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) { // Checking if token is expired. N
                return true;
            }

            return false;
        } catch (err) {
            return false;
        }
    }

    setToken(idToken) {
        // Saves user token to localStorage
        localStorage.setItem('id_token', idToken);
    }

    getToken() {
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token');
    }

    logout() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('id_token');
        localStorage.removeItem('mobile');
        localStorage.removeItem('profile');
        localStorage.removeItem('public_key');
        localStorage.removeItem('txId');
    }

    getProfile() {
        // Using jwt-decode npm package to decode the token
        let result = this.fetch(`${this.domain}/user/profile`, {
            method: 'GET',
        })
            .then((res) => {
                localStorage.setItem('profile', JSON.stringify(res));
            });
    }

    getLocalProfile() {
        return JSON.parse(localStorage.getItem('profile'));
    }

    setProfile(data) {
        localStorage.setItem('profile', JSON.stringify(data));
    }

    fetch(url, options) {
        // performs api calls sending the required authentication headers
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };

        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (this.loggedIn()) {
            headers.Authorization = `Bearer ${this.getToken()}`;
        }


        return fetch(url, {
            method: options.method,
            async: options.async,
            body: options.body,
            cache: 'no-cache',
            headers,
            options,
        })
            .then(this._checkStatus)

    }

    _checkStatus(response) {
        // return response;
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
            return response;
        }
        const error = new Error(response.statusText);
        // error.response = response;
        // error.body = response.json();
        // console.log(error);
        throw error.body;
    }
}
