/**
 * user models.
 * create 2017/12/25
 * @author trungdv
 * @version $Id$
 * @copyright 2017 MIT
 */

var baseModel = require('./baseModel');
const Utils = require('../lib/utils.js');

module.exports = class employeeModel extends baseModel {
    constructor(dbConn) {
        super(dbConn, "employee", "person_id");
    }
    /**
     * get header of department
     * @param {id} department_id 
     * @author hanhdx
     */
    get_header_department(department_id) {
        var t = this;
        var conds = [];
        var orderBy = [];
        conds['d.department_id'] = department_id;
        t.join('department d', t.table + '.person_id = d.head_id', 'LEFT');
        t.join('user u', t.table + '.person_id = u.person_id', 'INNER');
        t.selectFields(' employee.*, d.vi_name as department, u.signature_url');
        return t.firstAsync(conds, orderBy);
    }
    /**
     * get direcror of hospital
     * @param {id} person_id 
     * @author hanhdx
     */
     get_director_hospital(person_id) {
        var t = this;
        var conds = [];
        var orderBy = [];
        conds['u.person_id'] = person_id;
        t.join('user u', t.table + '.person_id = u.person_id', 'INNER');
        t.selectFields(' employee.*, u.signature_url');
        return t.firstAsync(conds, orderBy);
    }

    /**
    * get autocomplete data employee
    * @author: khanh
    */
    async get_auto_employee(data) {
        let t = this;
        let conds = [];
        if (!Utils.isEmpty(data.name)) {
            conds['name LIKE'] = '%' + data.name + '%';
        }
        if (!Utils.isEmpty(data.type_id)) {
            conds['employee_type_id'] = data.type_id;
        }
        if (data.enable) {
            conds['enable'] = data.enable;
        }
        t.selectFields("person_id, name");
        return t.findAsync(conds, [], data.limit);
    }
};