<?php

/*
 * Plugin Name:       Debt Repayment Calculator
 * Plugin URI:        https://useworkhero.com/
 * Description:       Debt Repayment Calculator - Handles Calculation
 * Version:           1.0
 * Author:            Djofil Demerin
 */

 if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class DebtRepaymentCalculator {

    public function init(){
        add_shortcode( 'debt-repayment-calculator', [$this, 'render_shortcode'] );
        add_action( 'wp_enqueue_scripts', [$this, 'enqueue_styles_scripts'] );
    }

    public function render_shortcode( $atts ){
        $atts = shortcode_atts(array( 
            'debt-repayment-calculator' => self::create_form_layout()
        ), $atts );

        wp_enqueue_style( 'debt-calculator-style' );
        wp_enqueue_script( 'debt-calculator-script' );
        return $atts['debt-repayment-calculator'];
    }

    public static function enqueue_styles_scripts(){
        wp_register_style( 'debt-calculator-style',  plugins_url( '/css/debt-repayment-calculator.css', __FILE__ ), [], date('dmy'), 'all' );
        wp_register_script( 'debt-calculator-script',  plugins_url( '/js/debt-repayment-calculator.js', __FILE__ ), [], date('dmy'), true );

        wp_enqueue_style( 'debt-calculator-style' );
        wp_enqueue_script( 'debt-calculator-script' );
    }

    public static function create_form_layout(){
        
        ob_start();
        ?>
            <div class="row debt-shortcode">
                <div class="column column-1">
                    <h2 class="wp-block-heading">
                        <strong>Debt Repayment Calculator</strong>
                    </h2>
                    <p>See how long it could take to pay off your credit card debt.</p>
                    <h3><strong>Start with your details.</strong></h3>
                    <form method="POST" id="repayment-calculator">
                        <label for="balanced-owned">Balanced owned</label>
                        <input type="number" id="balanced-owned" name="balanced-owned" placeholder="$ 0" required>
                        
                        <label for="estimated-interest-rate">Estimated interest rate</label>
                        <input type="number" id="estimated-interest-rate" name="estimated-interest-rate" placeholder="0"  step="any" required>

                        <hr>

                        <h3>Input only one of the following:</h3>
                        <div class="row row-debt">
                            <div class="column column-1">
                                <input type="radio" name="radio-payment" id="expected-monthly-payment" value="payment" checked>
                                <label for="expected-monthly-payment">Expected Monthy Payment</label>
                            </div>
                            <div class="column column-2">
                                <input type="radio" name="radio-payment" id="desired-months-to-pay-off" value="payoff">
                                <label for="desired-months-to-pay-off">Desired months to pay off</label>
                            </div>
                        </div>                        
                        <p>Estimate your payment</p>

                        <div class="row row-debt">
                            <div class="column column-1"><input type="number" id="monthly-payment" name="monthly-payment" placeholder="$ 0" step="any" required></div>
                            <div class="column column-2"><input type="number" id="desired-num-months" name="desired-num-months" placeholder="$ months" step="any" required></div>
                        </div>

                        <?php wp_nonce_field( 'calculate', 'debt-repayment-calculator' ); ?>
                        <button type="submit" id="calculate">Calculate</button>
                        <button type="reset" id="reset">Start Over</button>
                        <p>This calculator is meant for educational purposes only. It calculates estimated monthly payments solely based on the information you provide. The estimated monthly payments generated from the calculator do not constitute an offer Credit Karma.</p>
                    </form>
                </div>
                <div class="column column-2" id="aside">
                    <h2>Your estimated monthly payment</h2>
                    <p id="estimated-monthly-payment">
                        <span id="emp-value">$ 0</span>
                    </p>
                    <hr>
                    <p>Months to pay off</p>
                    <p><span id="mpo-value">0 months</span></p>
                    <p>Total principal paid</p>
                    <p><span id="tpp-value">$ 0</span></p>
                    <p>Total interest paid</p>
                    <p><span id="tip-value">$ 0</span></p>
                </div>
            </div>
        <?php
        return ob_get_clean();
    }


}
$debt_calculator = new DebtRepaymentCalculator();
$debt_calculator->init();