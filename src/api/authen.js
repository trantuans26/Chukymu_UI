const PREFIX_EMPLOYEE = "Employees";
export default (axios) => ({
    /**
     * @description: Đăng nhập
     * @param {String} username 
     * @param {String} password 
     * @return {Promise} Promise
     * Author: tttuan 1/3/2023
     */
    login(username, password) {
        return axios.get(`${PREFIX_EMPLOYEE}/login?username=${username}&password=${password}`, 
            {
                
            }
        );
    },
});
