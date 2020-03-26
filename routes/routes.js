var express       = require('express')
var multer        = require('multer')
var USER          = require('../controllers/user.controller')
var ROL           = require('../controllers/rol.actions.controller')
var REPORT        = require('../controllers/reports.controller')
var PRODUCT       = require('../controllers/product.controller')
var SHOPPINGCART  = require('../controllers/shoppingcart.controller')
var DESIRED       = require('../controllers/desired.controller')
var BUY           = require('../controllers/buy.controller')
var ADDRESS       = require('../controllers/address.controller')
var RECIPE        = require('../controllers/recipe.controller')
var DISCOUNT      = require('../controllers/discount.controller')

var upload        = multer({ dest:'uploads/' })

var app = express.Router()

app.get("/", function(req, res, next) {

  res.status(200).send({info:"Welcome to our restful API"})
  
});

var baseurl = '/api/'

app.post(baseurl + 'user/login',                 /*clientOauth.verify,*/  USER.login)
app.get (baseurl + 'user/list',                                           USER.listUsers)
app.get (baseurl + 'user/:idUser/role',                                   USER.getRole)
app.get (baseurl + 'user/:idUserToRol/rol/:idRol',                        USER.setRole)
app.post(baseurl + 'user/update',                                         USER.updateUser)
app.post(baseurl + 'user/change/password',                                USER.updatePassword)
app.post(baseurl + 'user/change/email',                                   USER.updateEmail)
app.post(baseurl + 'user',                                                USER.newUser)
app.get (baseurl + 'user/roles',                                          USER.listRoles)
app.put (baseurl + 'user/:idUser/activate',                               USER.updateActivateUser)
app.put (baseurl + 'user/:idUser/update',                                 USER.updateUserAdmin)
app.post(baseurl + 'user/:idUser/change/password',                        USER.updatePasswordAdmin)

app.post(baseurl + 'rol',                                                 ROL.addRol)
app.put (baseurl + 'rol/:idRol',                                          ROL.updateRol)
app.delete(baseurl + 'rol/:idRol',                                        ROL.deleteRol)
app.get (baseurl + 'action',                                              ROL.listActions)
app.get (baseurl + 'rol/:idRol/action',                                   ROL.listActionsByRol)
app.get (baseurl + 'rol/:idRol/action/:idAction',                         ROL.addActionRefInRol)
app.delete(baseurl + 'rol/:idRol/action/:idAction',                       ROL.deleteActionRefRol)

app.get  (baseurl + 'product/bulkload',                                   PRODUCT.bulkload)
app.post (baseurl + 'product',                                            PRODUCT.createProduct)
app.get  (baseurl + 'product/list/page/:page/limit/:limit',               PRODUCT.listProducts)
app.post (baseurl + 'product/category',                                   PRODUCT.createCategoryProduct)
app.get  (baseurl + 'product/category/list',                              PRODUCT.listCategoriesProduct)
app.post (baseurl + 'product/color',                                      PRODUCT.createColorProduct)
app.get  (baseurl + 'product/color/list',                                 PRODUCT.listColorsProduct)
app.post (baseurl + 'product/typemedida',                                 PRODUCT.createTypemedidaProduct)
app.get  (baseurl + 'product/typemedida/list',                            PRODUCT.listTypemedidasProduct)
app.get  (baseurl + 'product/:idProduct',                                 PRODUCT.getProduct)
app.post (baseurl + 'product/listby/category',                            PRODUCT.getProductByCategory)
app.get  (baseurl + 'product/:idProduct/image',                           PRODUCT.imageByProduct)
app.get  (baseurl + 'product/:idProduct/discount/:idDiscount',            PRODUCT.setDiscount)
app.get  (baseurl + 'product/:idProduct/removeDiscount',                  PRODUCT.removeDiscount)

app.get  (baseurl + 'shoppingcart/idUser/:idUser/clean',                                 SHOPPINGCART.cleanShoppingcart)
app.put  (baseurl + 'shoppingcart/idUser/:idUser/add',                                   SHOPPINGCART.addProduct)
app.delete(baseurl + 'shoppingcart/idUser/:idUser/product/:idProduct/remove',            SHOPPINGCART.removeProduct)
app.get  (baseurl + 'shoppingcart/idUser/:idUser',                                       SHOPPINGCART.myShoppingcart)

app.get  (baseurl + 'desired/idUser/:idUser/clean',                                      DESIRED.cleanDesired)
app.put (baseurl + 'desired/idUser/:idUser/add',                                         DESIRED.addProduct)
app.delete(baseurl + 'desired/idUser/:idUser/product/:idProduct/remove',                 DESIRED.removeProduct)
app.get  (baseurl + 'desired/idUser/:idUser',                                            DESIRED.myDesired)

app.get  (baseurl + 'buy/idUser/:idUser/list',                                           BUY.buyList)
app.get  (baseurl + 'buy/shoppingcart/idUser/:idUser/address/:address',                  BUY.buyShoppingcart)
app.get  (baseurl + 'buy/desired/idUser/:idUser',                                        BUY.buyDesired)
app.get  (baseurl + 'buy/:idBuy',                                                        BUY.buyById)

app.put  (baseurl + 'address/idUser/:idUser/add',                                        ADDRESS.addAddress)
app.get  (baseurl + 'address/idUser/:idUser/list',                                       ADDRESS.listAddress)
app.delete(baseurl + 'address/:idAddress/remove',                                        ADDRESS.removeAddress)

app.put  (baseurl + 'recipe/idUser/:idUser/add',                                         RECIPE.addRecipe)
app.get  (baseurl + 'recipe/list/page/:page/limit/:limit',                               RECIPE.listRecipes)
app.get  (baseurl + 'recipe/:idRecipe',                                                  RECIPE.getRecipe)
app.get  (baseurl + 'recipe/:idRecipe/image',                                            RECIPE.imageByRecipe)
app.get  (baseurl + 'recipe/:idRecipe/discount/:idDiscount',                             RECIPE.setDiscount)
app.get  (baseurl + 'recipe/:idRecipe/removeDiscount',                                   RECIPE.removeDiscount)


app.post (baseurl + 'discount/add',                                                      DISCOUNT.addDiscount)
app.get  (baseurl + 'discount/list/page/:page/limit/:limit',                             DISCOUNT.listDiscounts)
app.get  (baseurl + 'discount/:idDiscount',                                              DISCOUNT.getDiscount)
app.put  (baseurl + 'discount/:idDiscount',                                              DISCOUNT.editDiscount)


//app.get (baseurl + 'report/crrp/begin/:dateBegin/end/:dateEnd/download/:download',                REPORT.dateCorrespondencia)
//app.get (baseurl + 'report/flows/pending/crrp/begin/:dateBegin/end/:dateEnd/download/:download',  REPORT.usersFlowsPending)
//app.get (baseurl + 'report/flows/steps/crrp/begin/:dateBegin/end/:dateEnd/download/:download',    REPORT.stepFlowsByUsers)
//app.get (baseurl + 'report/flows/status/crrp/download/:download',                                 REPORT.statusFlows)

module.exports = app;