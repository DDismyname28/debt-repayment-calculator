jQuery(document).ready(function($) {

    var checkRadio = 1;

    $('#repayment-calculator').on('submit', function (e) {
        e.preventDefault();

            append_html_pmt();
            append_html_mpo();
            append_html_tpp();
            append_html_tip();

            console.log(calculate_nper());
    });
    $('#repayment-calculator').on('reset', function (e) {
        e.preventDefault();

        $('#emp-value').html('$ 0');
        $('#mpo-value').html('0 months');
        $('#tpp-value').html('$ 0');
        $('#tip-value').html('$ 0');
        $('#balanced-owned').val('');
        $('#estimated-interest-rate').val('');
        $('#monthly-payment').val('');
    });

    initialize_inputs();

    function get_radio_btn_values(){
        var radioval = $('input[name="radio-payment"]:checked').val();
        console.log(radioval);

        return radioval;
    }

    $('input[name="radio-payment"]').on('click', function (e) {
        let val = $(this).val();

        switch (val) {
            case 'payment':
                disable_attribute_desired_num_months();
                break;
            case 'payoff':
                disable_attribute_monthly_payment();
                break;
            default:
                break;
        }
    });

    function initialize_inputs(){
        $('#desired-num-months').prop('disabled', true);
    }

    function fetch_balance_owned(){
        let balance_owned = $('#balanced-owned').val();
        return balance_owned;
    }

    function fetch_get_estimated_interest_rate(){
        let estimated_interest_rate = $('#estimated-interest-rate').val();
        estimated_interest_rate = (estimated_interest_rate / 100);
        return estimated_interest_rate;
    }

    function fetch_get_monthly_payment(){
        let monthly_payment = $('#monthly-payment').val();
        return monthly_payment;
    }

    function fetch_desired_num_months(){
        let desired_num_months = $('#desired-num-months').val();
        return desired_num_months;
    }

    function disable_attribute_desired_num_months(){
        checkRadio = 1;
        $('#aside h2').html('Your estimated months to pay off');
        let nothing = $('#desired-num-months').attr('disabled');
        let clear = $('#desired-num-months');
        if(nothing != 'undefined'){
            $('#desired-num-months').prop('disabled', true);
        }
        $('#monthly-payment').prop('disabled', false);
        clearInputData(clear);
    }

    function disable_attribute_monthly_payment(){
        checkRadio = 2;
        $('#aside h2').html('Your estimated monthly payment');
        let nothing = $('#monthly-payment').attr('disabled');
        let clear = $('#monthly-payment');
        if(nothing != 'undefined'){
            $('#monthly-payment').prop('disabled', true);
        }
        $('#desired-num-months').prop('disabled', false);
        clearInputData(clear);
    }

    function calculate_pmt(){
        let pv = fetch_balance_owned();
        let ir = fetch_get_estimated_interest_rate() / 12;
        let np = fetch_desired_num_months();
        let fv = 0; 

        // ir: interest rate
        // np: number of payment
        // pv: present value or loan amount
        // fv: future value. default is 0

        var presentValueInterstFector = Math.pow((1 + ir), np);
        var pmt = ir * pv  * (presentValueInterstFector + fv) / (presentValueInterstFector - 1); 
        return pmt;
    }

    function calculate_nper(){
        let pv = fetch_balance_owned();
        let ir = fetch_get_estimated_interest_rate() / 12;
        let pmt = fetch_get_monthly_payment();
        let fv = 0;

        let a = pmt/ir;
        let b = a - pv;
        let c = a/b;
        let d = Math.log(c);
        let e = 1 + ir;
        let f = Math.log(e);

        let nper = d/f;

        return Math.round(nper);
    }

    function total_principal_paid(){
        let totalPrincipalPaid = calculate_pmt() * fetch_desired_num_months ();
        return totalPrincipalPaid;
    }

    function total_interest_paid(){
        let totalInterestPaid = total_principal_paid() - fetch_balance_owned();
        return totalInterestPaid;
    }

    function append_html_pmt(){
        let data;
        let id = '#emp-value';
        let action;
        
        if(checkRadio == 2){
            data = $('#emp-value').html(calculate_pmt().toFixed(3));
            action = calculate_pmt().toFixed(3);
        }else {
            data = $('#emp-value').html(fetch_get_monthly_payment());
            action = fetch_get_monthly_payment();
        }
        animateDate(data, action, id);
    }

    function append_html_mpo(){
        let data;
        let id = '#tpp-value';
        let action;

        if(checkRadio == 2){
            data = $('#mpo-value').html(fetch_desired_num_months());
            action = fetch_desired_num_months();
        }else {
            data = $('#mpo-value').html(calculate_nper());
            action = calculate_nper();
        }
        animateDate(data, action, id);
    }

    function append_html_tpp(){
        let data;
        let id = '#tpp-value';
        let action;

        if(checkRadio == 2){
            data = $('#tpp-value').html(total_principal_paid().toFixed(3));
            action = total_principal_paid().toFixed(3);
        }else {
            data = $('#tpp-value').html(calculate_nper_total_principal_paid().toFixed(3));
            action = calculate_nper_total_principal_paid().toFixed(3);
        }
        animateDate(data, action, id);
    }
    
    function append_html_tip(){
        let data;
        let id = '#tip-value';
        let action;
        
        if(checkRadio == 2){
            data = $('#tip-value').html(total_interest_paid().toFixed(3));
            action = total_interest_paid().toFixed(3);
        }else {
            data = $('#tip-value').html(calculate_nper_total_interest_paid().toFixed(3));
            action = calculate_nper_total_interest_paid().toFixed(3);
        }
        animateDate(data, action, id);
    }

    function clearInputData(clear){
        clear.val('');
        $('#emp-value').html('$ 0');
        $('#mpo-value').html('0 months');
        $('#tpp-value').html('$ 0');
        $('#tip-value').html('$ 0');
    }

    function animateDate(data, action, id){
        $({ countNum: data }).animate({ countNum: action }, {
            duration: 2500,
            easing: 'linear',
            step: function () {
            if(id != '#mpo-value') {
                var dollar = '$ ';
            }else {
                dollar = '';
            }
            $(id).html(dollar + Math.floor(this.countNum));
        },
        complete: function () {
            if(id != '#mpo-value') {
                var dollar = '$ ';
            }else {
                dollar = '';
            }
            $(id).html(dollar + this.countNum);
        }
        });
    }


    // nper functions

    function calculate_nper_total_principal_paid(){
        let totalPrincipalPaid = fetch_get_monthly_payment() * calculate_nper();
        return totalPrincipalPaid;
    }

    function calculate_nper_total_interest_paid(){
        let totalInterestPaid = calculate_nper_total_principal_paid() - fetch_balance_owned();
        return totalInterestPaid;
    }
});