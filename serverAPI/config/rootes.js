/**
 * Configs.
 * create 2018/11/15
 * @author trungdv
 * @version $Id$
 * @copyright 2017 MIT
 */ 
var Rooters = [];
/************ root for user */
Rooters['users'] = [];
Rooters['users/(:any)'] = [];

Rooters['users/(:any)']['get'] = 'user/find/$1'; // get one user by id
Rooters['users']['get'] = 'user/find';  // get all user

Rooters['users/find'] = [];
Rooters['users/find']['post'] = 'user/find'; // get users with post param

Rooters['users/(:any)']['post'] = 'user/save/$1'; // add user
Rooters['users']['post'] = 'user/save'; // add multi user

Rooters['users/(:any)']['put'] = 'user/update/$1'; // update user
Rooters['users']['put'] = 'user/update'; // update multi users

Rooters['users/(:any)']['delete'] = 'user/delete/$1'; // delete user
Rooters['users']['delete'] = 'user/delete'; // delete multi users
/************ END root for user */

/************ root for service */
Rooters['services'] = [];
Rooters['services/(:any)'] = [];

Rooters['services/(:any)']['get'] = 'service/find/$1'; // get one service by id
Rooters['services']['get'] = 'service/find';  // get all service

Rooters['services/find'] = [];
Rooters['services/find']['post'] = 'service/find'; // get services with post param
// Rooters['services/findAutocomplete']['post'] = 'service/findAutocomplete'; // get services with post param

Rooters['services/(:any)']['post'] = 'service/save/$1'; // add service
Rooters['services']['post'] = 'service/save'; // add multi service

Rooters['services/(:any)']['put'] = 'service/update/$1'; // update service
Rooters['services']['put'] = 'service/update'; // update multi services

Rooters['services/(:any)']['delete'] = 'service/delete/$1'; // delete service
Rooters['services']['delete'] = 'service/delete'; // delete multi services
/************ END root for service */

/************ root for tt37 */
Rooters['service_tt37s'] = [];
Rooters['service_tt37s/(:any)'] = [];

Rooters['service_tt37s/(:any)']['get'] = 'service_tt37/find/$1'; // get one service_tt37 by id
Rooters['service_tt37s']['get'] = 'service_tt37/find';  // get all service_tt37

Rooters['service_tt37s/find'] = [];
Rooters['service_tt37s/find']['post'] = 'service_tt37/find'; // get service_tt37s with post param

Rooters['service_tt37s/(:any)']['post'] = 'service_tt37/save/$1'; // add service_tt37
Rooters['service_tt37s']['post'] = 'service_tt37/save'; // add multi service_tt37

Rooters['service_tt37s/(:any)']['put'] = 'service_tt37/update/$1'; // update service_tt37
Rooters['service_tt37s']['put'] = 'service_tt37/update'; // update multi service_tt37s

Rooters['service_tt37s/(:any)']['delete'] = 'service_tt37/delete/$1'; // delete service_tt37
Rooters['service_tt37s']['delete'] = 'service_tt37/delete'; // delete multi service_tt37s
/************ END root for tt37 */

/************ root for tt43 */
Rooters['service_tt43s'] = [];
Rooters['service_tt43s/(:any)'] = [];

Rooters['service_tt43s/(:any)']['get'] = 'service_tt43/find/$1'; // get one service_tt43 by id
Rooters['service_tt43s']['get'] = 'service_tt43/find';  // get all service_tt43

Rooters['service_tt43s/find'] = [];
Rooters['service_tt43s/find']['post'] = 'service_tt43/find'; // get service_tt43s with post param

Rooters['service_tt43s/(:any)']['post'] = 'service_tt43/save/$1'; // add service_tt43
Rooters['service_tt43s']['post'] = 'service_tt43/save'; // add multi service_tt43

Rooters['service_tt43s/(:any)']['put'] = 'service_tt43/update/$1'; // update service_tt43
Rooters['service_tt43s']['put'] = 'service_tt43/update'; // update multi service_tt43s

Rooters['service_tt43s/(:any)']['delete'] = 'service_tt43/delete/$1'; // delete service_tt43
Rooters['service_tt43s']['delete'] = 'service_tt43/delete'; // delete multi service_tt43s
/************ END root for tt43 */

/************ root for drug_original_name */
Rooters['manufacturers'] = [];
Rooters['manufacturers/(:any)'] = [];

Rooters['manufacturers/(:any)']['get'] = 'manufacturer/find/$1'; // get one manufacturer by id
Rooters['manufacturers']['get'] = 'manufacturer/find';  // get all manufacturer

Rooters['manufacturers/find'] = [];
Rooters['manufacturers/find']['post'] = 'manufacturer/find'; // get manufacturer with post param

Rooters['manufacturers/(:any)']['post'] = 'manufacturer/save/$1'; // add manufacturer
Rooters['manufacturers']['post'] = 'manufacturer/save'; // add multi manufacturer

Rooters['manufacturers/(:any)']['put'] = 'manufacturer/update/$1'; // update manufacturer
Rooters['manufacturers']['put'] = 'manufacturer/update'; // update multi manufacturer

Rooters['manufacturers/(:any)']['delete'] = 'manufacturer/delete/$1'; // delete manufacturer
Rooters['manufacturers']['delete'] = 'manufacturer/delete'; // delete multi manufacturer
/************ END root for manufacturer */

/************ root for drug_original_name */
Rooters['drug_original_names'] = [];
Rooters['drug_original_names/(:any)'] = [];

Rooters['drug_original_names/(:any)']['get'] = 'drug_original_name/find/$1'; // get one drug_original_name by id
Rooters['drug_original_names']['get'] = 'drug_original_name/find';  // get all drug_original_name

Rooters['drug_original_names/find'] = [];
Rooters['drug_original_names/find']['post'] = 'drug_original_name/find'; // get drug_original_name with post param

Rooters['drug_original_names/(:any)']['post'] = 'drug_original_name/save/$1'; // add drug_original_name
Rooters['drug_original_names']['post'] = 'drug_original_name/save'; // add multi drug_original_name

Rooters['drug_original_names/(:any)']['put'] = 'drug_original_name/update/$1'; // update drug_original_name
Rooters['drug_original_names']['put'] = 'drug_original_name/update'; // update multi drug_original_name

Rooters['drug_original_names/(:any)']['delete'] = 'drug_original_name/delete/$1'; // delete drug_original_name
Rooters['drug_original_names']['delete'] = 'drug_original_name/delete'; // delete multi drug_original_name
/************ END root for drug_original_name */

/************ root for service_package */
Rooters['service_packages'] = [];
Rooters['service_packages/(:any)'] = [];

Rooters['service_packages/(:any)']['get'] = 'service_package/find/$1'; // get one service_package by id
Rooters['service_packages']['get'] = 'service_package/find';  // get all service_package

Rooters['service_packages/find'] = [];
Rooters['service_packages/find']['post'] = 'service_package/find'; // get service_package with post param

Rooters['service_packages/(:any)']['post'] = 'service_package/save/$1'; // add service_package
Rooters['service_packages']['post'] = 'service_package/save'; // add multi service_package

Rooters['service_packages/(:any)']['put'] = 'service_package/update/$1'; // update service_package
Rooters['service_packages']['put'] = 'service_package/update'; // update multi service_package

Rooters['service_packages/(:any)']['delete'] = 'service_package/delete/$1'; // delete service_package
Rooters['service_packages']['delete'] = 'service_package/delete'; // delete multi service_package
/************ END root for service_package */

module.exports = Rooters;