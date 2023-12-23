const PREFIX_DEPARTMENT = "departments";
export default (axios) => ({
  getDepartments: () => axios.get(`${PREFIX_DEPARTMENT}`),
});
