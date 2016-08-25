
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

var session = require('client-sessions');
app.use(session({
    cookieName: 'session',
    secret: 'megsoft',
    duration: 10 * 60 * 1000,
    activeDuration: 10 * 60 * 1000,
}));


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}


var objCommon = require('./routes/Common');
var objCountry = require('./routes/Country');
var objState = require('./routes/State');
var objCity = require('./routes/City');
var objConstant = require('./routes/Constant');
var objAgent = require('./routes/Agent');
var objSubAgent = require('./routes/SubAgent');
var objClient = require('./routes/Client');
var objPaymentTerms = require('./routes/PaymentTerms');
var objFreightCharges = require('./routes/FreightCharges');
var objInsurance = require('./routes/Insurance');
var objIncoTerm = require('./routes/IncoTerms');
var objApplicationStatus = require('./routes/ApplicationStatus');
var objShipBy = require('./routes/ShipBy');
var objCurrency = require('./routes/Currency');
var objCreditId = require('./routes/CreditId');
var objBank = require('./routes/Bank');
var objBenificiary = require('./routes/Benificiary');
var objAgentProfile = require('./routes/AgentProfile');
var objSubAgentProfile = require('./routes/SubAgentProfile');
var objClientProfile = require('./routes/ClientProfile');
var objLogin = require('./routes/Login');
var objForgotPassword = require('./routes/ForgotPassword');
var objRights = require('./routes/Rights');
var objApplication = require('./routes/ApplicationDetails');
var objCreditTerms = require('./routes/LetterOfCredit');
var objAdminProfile = require('./routes/AdminProfile');
var objdashboard = require('./routes/Dashboard');


//app.get('/', routes.index);
app.get('/', objLogin.LoginLoad);

app.get('/Index', routes.index);


//Route Config for Country page
app.post('/Country', objCountry.GetCountryData);
app.get('/Country', objCountry.CountryList);
app.post('/Country/save', objCountry.save);
app.post('/Country/:Id', objCountry.transact);

//Route Config for State page
app.post('/State', objState.GetStateData);
app.get('/State', objState.StateList);
app.post('/State/save', objState.save);
app.post('/State/:Id', objState.transact);

//Route Config for City page
app.post('/City', objCity.GetCityData);
app.get('/City', objCity.GetCityList);
app.post('/City/save', objCity.save);
app.post('/City/:Id', objCity.transact);
app.post('/Constant/GetCountryData', objCommon.GetCountryData);
app.post('/Constant/GetStateData', objCommon.GetStateData);


//Route Config for Constant page
app.post('/Constant', objConstant.GetConstantData);
app.get('/Constant', objConstant.Constantlist);
app.post('/Constant/GetCountryData', objCommon.GetCountryData);
app.post('/Constant/GetStateData', objCommon.GetStateData);
app.post('/Constant/GetCityData', objCommon.GetCityData);
app.post('/Constant/save', objConstant.save);
app.post('/Constant/:uid', objConstant.transact);


//Route Config for Agent page
app.post('/Agent', objAgent.GetAgentData);
app.get('/Agent', objAgent.Agentlist);
app.post('/Agent/save', objAgent.save);
app.post('/Agent/:uid', objAgent.transact);


app.get('/AgentProfile', objAgentProfile.Agentlist);
app.post('/AgentProfile/:uid', objAgentProfile.transact);
app.get('/AgentProfile/:uid', objAgentProfile.Agentlist)


//Route Config for SubAgent page
app.post('/SubAgent', objSubAgent.GetSubAgentData);
app.get('/SubAgent', objSubAgent.SubAgentlist);
app.post('/SubAgent/save', objSubAgent.save);
app.post('/SubAgent/:uid', objSubAgent.transact);


app.get('/SubAgentProfile', objSubAgentProfile.SubAgentlist);
app.post('/SubAgentProfile/:uid', objSubAgentProfile.transact);
app.get('/SubAgentProfile/:uid', objSubAgentProfile.SubAgentlist)



//Route Config for Client page
app.post('/Client', objClient.GetClientData);
app.get('/Client', objClient.Clientlist);
app.post('/Client/save', objClient.save);
app.post('/Client/:uid', objClient.transact);

app.get('/ClientProfile', objClientProfile.Clientlist);
app.post('/ClientProfile/:uid', objClientProfile.transact);
app.get('/ClientProfile/:uid', objClientProfile.Clientlist)


//Route Config for PaymentTerms page
app.post('/PaymentTerms', objPaymentTerms.GetPaymentTermsData);
app.get('/PaymentTerms', objPaymentTerms.GetPaymentTermslist);
app.post('/PaymentTerms/save', objPaymentTerms.save);
app.post('/PaymentTerms/:Id', objPaymentTerms.transact);

//Route Config for FreightCharges page
app.post('/FreightCharges', objFreightCharges.GetFreightChargesData);
app.get('/FreightCharges', objFreightCharges.GetFreightChargeslist);
app.post('/FreightCharges/save', objFreightCharges.save);
app.post('/FreightCharges/:Id', objFreightCharges.transact);

//Route Config for  Insurance page
app.post('/Insurance', objInsurance.GetInsuranceData);
app.get('/Insurance', objInsurance.GetInsurancelist);
app.post('/Insurance/save', objInsurance.save);
app.post('/Insurance/:Id', objInsurance.transact);

//Route Config for IncoTerms page
app.post('/IncoTerms', objIncoTerm.GetIncoTermData);
app.get('/IncoTerms', objIncoTerm.GetIncoTermlist);
app.post('/IncoTerms/save', objIncoTerm.save);
app.post('/IncoTerms/:Id', objIncoTerm.transact);

//Route Config for  ApplicationStatus page
app.post('/ApplicationStatus', objApplicationStatus.GetApplicationStatusData);
app.get('/ApplicationStatus', objApplicationStatus.GetApplicationStatuslist);
app.post('/ApplicationStatus/save', objApplicationStatus.save);
app.post('/ApplicationStatus/:Id', objApplicationStatus.transact);




//Currency
app.post('/Currency', objCurrency.GetCurrencyData);
app.get('/Currency', objCurrency.CurrencyList);
app.post('/Currency/save', objCurrency.save);
app.post('/Currency/:Id', objCurrency.transact);

//ShipBy
app.post('/ShipBy', objShipBy.GetShipByData);
app.get('/ShipBy', objShipBy.ShipByList);
app.post('/ShipBy/save', objShipBy.save);
app.post('/ShipBy/:Id', objShipBy.transact);

//CreditId
app.post('/CreditId', objCreditId.GetCreditIdData);
app.get('/CreditId', objCreditId.CreditIdList);
app.post('/CreditId/save', objCreditId.save);
app.post('/CreditId/:Id', objCreditId.transact);
app.get('/Common/LcaNoGenerate', objCommon.LcaNoGenerate);//Id generation

//Bank
app.post('/Bank', objBank.GetBankData);
app.get('/Bank', objBank.BankList);
app.post('/Bank/save', objBank.save);
app.post('/Bank/:Id', objBank.transact);
app.post('/Common/GetAgentData', objCommon.GetAgentData);//drop down binding

//Benificiary
app.post('/Benificiary', objBenificiary.GetBenificiaryData);
app.get('/Benificiary', objBenificiary.BenificiaryList);
app.post('/Benificiary/save', objBenificiary.save);
app.post('/Benificiary/:Id', objBenificiary.transact);


//Login
app.get('/Login', objLogin.LoginLoad);
app.post('/Login/validate', objLogin.validate);
app.post('/Common/SubMenu', objCommon.SubMenu);
app.post('/Common/MainMenu', objCommon.MainMenu);


//Rights
app.get('/Rights', objRights.Load);
app.post('/Rights/GetMenuslst', objRights.GetMenuslst);
app.post('/Rights/GetMenuTypes', objRights.GetMenuTypes);
app.post('/Rights/LoadMenus', objRights.LoadMenus);
app.post('/Rights/LoadUsertypeSetting', objRights.LoadUsertypeSetting);
app.post('/Rights/LoadTeamSetting', objRights.LoadTeamSetting);
app.post('/Rights/AddMenuDetails', objRights.AddMenuDetails);
app.post('/Rights/SaveTeamUsertypesettings', objRights.SaveTeamUsertypesettings);
app.post('/Rights/DeleteMenuDetails', objRights.DeleteMenuDetails);
app.post('/Rights/GetMenusDetByID', objRights.GetMenusDetByID);
app.post('/Rights/getAccessValues', objRights.getAccessValues);
app.post('/Rights/GetMenuByID', objRights.GetMenuByID);
app.post('/Rights/MenuSortUpByID', objRights.MenuSortUpByID);
app.post('/Rights/MenuSortDownByID', objRights.MenuSortDownByID);
app.post('/Rights/EditMenuDetails', objRights.EditMenuDetails);
app.post('/Rights/LoadPage', objRights.LoadPage);




// objForgotPassword
app.get('/ForgotPassword', objForgotPassword.Load);
app.post('/ForgotPassword/validate', objForgotPassword.validate);


//LetterOfCredit

app.get('/LetterOfCredit', objCreditTerms.display);
app.post('/LetterOfCredit/save', objCreditTerms.save);
app.post('/LetterOfCredit/Upload', objCreditTerms.Upload);
app.post('/LetterOfCredit/deletefile', objCreditTerms.deletefile);

//drop down binding for LetterOfCredit
app.post('/Common/GetPaymentTerms', objCommon.GetPaymentTerms);
app.post('/Common/GetCurrency', objCommon.GetCurrency);
app.post('/Common/GetIncoterms', objCommon.GetIncoterms);
app.post('/Common/GetShipBy', objCommon.GetShipBy);
app.post('/Common/GetFreightCharges', objCommon.GetFreightCharges);
app.post('/Common/GetInsurance', objCommon.GetInsurance);
app.post('/Common/GetApplicationStatus', objCommon.GetApplicationStatus);
app.post('/Common/GetBank', objCommon.GetBank);
app.post('/Common/GetBenificiary', objCommon.GetBenificiary);
app.get('/Common/GetSession', objCommon.GetSession);
app.post('/Common/GetDocumentType', objCommon.GetDocumentType);

//ApplicationDetails
app.post('/ApplicationDetails', objApplication.GetApplicationData);
app.get('/ApplicationDetails', objApplication.ApplicationList);
app.post('/ApplicationDetails/:Id', objApplication.transact);
app.get('/LetterOfCredit/GetApplicantDetails', objCreditTerms.GetApplicantDetails);
app.get('/ApplicationDetails/Download', objApplication.Download);
//Admin Profile 
app.get('/AdminProfile', objAdminProfile.Adminlist);
app.post('/AdminProfile/:uid', objAdminProfile.transact);
app.get('/AdminProfile/:uid', objAdminProfile.Adminlist)


//Dashboard
app.get('/Dashboard', objdashboard.DashboardList);
app.post('/Dashboard', objdashboard.GetDashboardData);




http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
