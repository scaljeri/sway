window.describe("Sway.data.ActiveRecord", function () {
    "use strict";

    var ns = {}
        , Physician
        , Appointment
        , Patient
        , Account
        , AccountHistory
        , Address
        , Hospital
        , physician
        , appointment
        , appointmentDate
        , appointment1
        , appointmentDate1
        , patient
        , patient1
        , address
        , address1
        , hospital
        , account
        , account1
        , accountHistory
        , accountHistory1;

    createMocksAndStubs(ns);

    new Sway.data.ActiveRecord('Physician', ns.persistance, [
        new Sway.data.Field('name')
        , new Sway.data.Relation('appointments', 'has_many', 'Appointment', { friendlyName: 'Appointments' })
        , new Sway.data.Relation('patients', 'has_many', 'Patient', { through: 'Appointment', friendlyName: 'Patients' })
        , new Sway.data.Relation('hospitals', 'has_and_belongs_to_many', 'Hospital', { friendlyName: 'Hospitals' })
    ]);

    new Sway.data.ActiveRecord('Appointment', ns.persistance, [
        new Sway.data.Field('appointmentDate', {type: 'date'})
        , new Sway.data.Relation('physician', 'belongs_to', 'Physician', { friendlyName: 'Physician' })
        , new Sway.data.Relation('patients', 'belongs_to', 'Patient', { friendlyName: 'Patient' })
    ]);

    new Sway.data.ActiveRecord('Patient', ns.persistance, [
        new Sway.data.Field('name')
        , new Sway.data.Relation('address', 'has_one', 'Address', { friendlyName: 'Address'})
        , new Sway.data.Relation('account', 'has_one', 'Account', { friendlyName: 'Account'})
        , new Sway.data.Relation('accountHistory', 'has_one', 'AccountHistory', { through: 'Account', friendlyName: 'Account History'})
        , new Sway.data.Relation('appointments', 'has_many', 'Appointment', { friendlyName: 'Appointments' })
        , new Sway.data.Relation('physicians', 'has_many', 'Physician', { through: 'Appointment', friendlyName: 'Physicians' })
    ]);

    new Sway.data.ActiveRecord('Address', ns.persistance, [
        new Sway.data.Field('street')
        , new Sway.data.Relation('patient', 'belongs_to', 'Patient')
    ]);

    new Sway.data.ActiveRecord('Account', ns.persistance, [
        new Sway.data.Field('name')
        , new Sway.data.Relation('patient', 'belongs_to', 'Patient', { friendlyName: 'Patient' })
        , new Sway.data.Relation('accountHistory', 'has_one', 'AccountHistory', { friendlyName: 'Account History' })
    ]);

    new Sway.data.ActiveRecord('AccountHistory', ns.persistance, [
        new Sway.data.Field('message')
        , new Sway.data.Relation('account', 'belongs_to', 'Account', { friendlyName: 'Account' })
    ]);

    new Sway.data.ActiveRecord('Hospital', ns.persistance, [
        new Sway.data.Field('name')
        , new Sway.data.Relation('physicians', 'has_and_belongs_to_many', 'Physician', { friendlyName: 'Physician' })
    ]);

    Physician = Sway.data.ActiveRecord.get('Physician');
    Appointment = Sway.data.ActiveRecord.get('Appointment');
    Patient = Sway.data.ActiveRecord.get('Patient');
    Account = Sway.data.ActiveRecord.get('Account');
    AccountHistory = Sway.data.ActiveRecord.get('AccountHistory');
    Address = Sway.data.ActiveRecord.get('Address');
    Hospital = Sway.data.ActiveRecord.get('Address');

    beforeEach(function () {


        /*class Physician < ActiveRecord::Base
         has_many :appointments
         has_many :patients, :through => :appointments
         end

         class Appointment < ActiveRecord::Base
         belongs_to :physician
         belongs_to :patient
         end

         class Patient < ActiveRecord::Base
         has_many :appointments
         has_many :physicians, :through => :appointments
         end

         class Supplier < ActiveRecord::Base
         has_one :account
         has_one :account_history, :through => :account
         end

         class Account < ActiveRecord::Base
         belongs_to :supplier
         has_one :account_history
         end

         class AccountHistory < ActiveRecord::Base
         belongs_to :account
         end
         */




        /*
         Below all possible relations are created. Also, the order in which they are established differ
         */
        /*
        account = new Account({ name: 'Foo Account' });                       // create an account without the belongs_to association
        account1 = new Account({ name: 'Bar Account' });                      // create an account without the belongs_to association
        accountHistory = new AccountHistory({ message: 'log message'});
        accountHistory1 = new AccountHistory({ message: 'log message'});
        address = new Address({ street: 'Avenue Princess Grace' });
        address1 = new Address({ street: 'Severn Road' });
        appointmentDate = new Date();
        appointment = new Appointment({ appointmentDate: appointmentDate });
        appointmentDate1 = new Date();
        appointment1 = new Appointment({ appointmentDate: appointmentDate });
        hospital = new Hospital();
        hospital.street = 'Cardiology & Heart Surgery';
        physician = new Physician({ name: 'John'});
        physician.hospitals = hospital;
        debugger ;
        patient = new Patient({ name: 'Sue', address: address, account: account, accountHistory: accountHistory });
        patient1 = new Patient({ name: 'Alexia', address: address1, account: account1, accountHistory: accountHistory1, appointment: appointment1 });
        physician.appointments = appointment;                                   // should link a patient
        patient.appointments = appointment;
        physician.patients = patient1;                                          // should link appointment to physician
        */

    });

    it("should exist", function () {
        expect(Sway.data.ActiveRecord).toBeDefined(); // the class
    });

    it("should create a model class", function () {
        expect(Sway.data.ActiveRecord.get('Physician')).toBeDefined();
        expect(Sway.data.ActiveRecord.get('Appointment')).toBeDefined();
        expect(Sway.data.ActiveRecord.get('Patient')).toBeDefined();
        expect(Sway.data.ActiveRecord.get('Account')).toBeDefined();
        expect(Sway.data.ActiveRecord.get('AccountHistory')).toBeDefined();
        expect(Sway.data.ActiveRecord.get('Hospital')).toBeDefined();
    });

    it("should create a record", function () {
        var p = new Physician( { name: 'John'} ) ;
        expect(p).toBeDefined() ;
        expect(p).toBeInstanceof(Physician) ;
        expect(p.name).toEqual('John') ;
    });

    describe("should support HAS_ONE/BELONGS_TO association", function () {
        it("and be able to create one", function () {
        });

        it("and be able to save one", function () {

        });

        it("and be able to load one", function () {

        });
    });

    describe("should support HAS_ONE/BELONGS_TO THROUGH association", function () {
        it("and be able to create one", function () {

        });

        it("and be able to save one", function () {

        });

        it("and be able to load one", function () {

        });
    });

    describe("should support HAS_MANY association", function () {
        it("and be able to create one", function () {

        });

        it("and be able to save one", function () {

        });

        it("and be able to load one", function () {

        });
    });

    describe("should support HAS_MANY THROUGH association", function () {
        it("and be able to create one", function () {

        });

        it("and be able to save one", function () {

        });

        it("and be able to load one", function () {

        });
    });

    xit("should create a HAS_AND_BELONGS_TO_MANY association", function () {

        /*
         Patient = new Sway.data.ActiveRecord.get('Patient') ;
         patient = new Patient({ name: 'Sue'}) ;

         // check HAS_MANY
         physician.patients = patient ;
         expect(physician.patients).toEqual([patient]) ;
         physician.patients = patient ;
         expect(physician.patients).toEqual([patient, patient]) ;
         physician.patients = [patient] ;
         expect(physician.patients).toEqual([patient]) ;
         */
    });

    xit("should find a stored record with callbacks", function () {

    });
    xit("should find a stored record without callbacks", function () {

    });

    xit("should find 1 stored record without callbacks", function () {
        /*
         var newRec = null
         , newRec1 = null  ;

         newRec = ns.User.find({username:'John', password: 'Secret'}) ;      // not async
         expect(newRec).toBeDefined() ;
         expect(newRec.birthday).toBeDefined() ;
         expect(newRec.birthday).toBeInstanceof(Date) ;
         expect(newRec.birthday).toEqual(new Date(79,5,24)) ;

         newRec.username = 'Sue' ;
         newRec1 = ns.User.find(newRec) ;
         expect(newRec1.username).toEqual('Sue') ;
         expect(newRec1.password).toEqual('Secret') ;
         expect(newRec.birthday).toBeInstanceof(Date) ;
         expect(newRec.birthday).toEqual(new Date(79,5,24)) ;
         */
    });

    xit("should find/load multiple stored record", function () {
        /*
         var newRec = null
         , newRec1 = null  ;

         newRec = ns.User.find({username:'John'}) ;      // not async
         expect(newRec.getLength()).toEqual(2) ;
         */
    });

    xit("should find/load a stored record with callbacks", function () {
        /*
         var newRec = null
         , isReady = false ;

         runs(function() {                                   // doing the same
         ns.User.find({username: 'John'}, function(r){
         newRec = r ;
         isReady = true ;            // ready, this will stop 'waitsFor'
         }) ;
         }) ;

         waitsFor(function(){ // waitsFor will stop if isReady === TRUE
         return isReady ;
         }, "a record search using JSON", 500) ;

         runs(function() {   // after waitsFor is ready this function will run
         expect(newRec).toBeDefined() ;
         expect(newRec.password).toEqual('Secret') ;

         newRec.username = 'Sue' ;
         isReady = false ;
         ns.User.find(newRec, function(r){
         newRec = r ;
         isReady = true ;            // ready, this will stop 'waitsFor'
         }) ;
         }) ;

         waitsFor(function() {
         return isReady ;
         }, "a record search using record object", 500 ) ;
         runs(function() {
         expect(newRec.username).toEqual('Sue') ;
         expect(newRec.password).toEqual('Secret') ;
         }) ;
         */
    });
    xit("should save a new record", function () {
        //var rec = new ns.User( { username: 'John', password: 'Secret'}) ;
    });
    xit("should update a record", function () {
        //var rec = new ns.User( { username: 'John', password: 'Secret'}) ;
    });

    function createMocksAndStubs(ns) {
        // fake Persitance
        ns.persistance = {
            find: function (record, callback) {
                var json = [
                    {username: (record.username || 'John'), password: (record.password || 'Secret'), birthday: new Date(79, 5, 24), __id__: 1}
                ];
                if (!record.password) {
                    json = [
                        {username: (record.username || 'John'), password: 'Secret1', birthday: new Date(79, 5, 24), __id__: 1}
                        ,
                        {username: (record.username || 'John'), password: 'Secret2', birthday: new Date(80, 5, 24), __id__: 2}
                    ];
                }
                if (callback) {
                    setTimeout(function () { // fake async
                        callback(json);
                    }, 1);
                }
                return json;
            }, save: function (record, callback) {
                // TODO
            }
        };
        spyOn(ns.persistance, 'find').andCallThrough();
        spyOn(ns.persistance, 'save').andCallThrough();

        ns.persistanceAsync = {
            find: function (record, callback) {
                setTimeout(function () {
                    callback({username: (record.username || 'John'), password: (record.password || 'Secret'), __id__: 2});
                }, 10);
            }, save: function (record) {
                // TODO
            }
        };

        spyOn(ns.persistanceAsync, 'find').andCallThrough(); // andReturn({username: 'John', password: 'Secret'}) ;
        spyOn(ns.persistanceAsync, 'save').andCallThrough();
    }
});
