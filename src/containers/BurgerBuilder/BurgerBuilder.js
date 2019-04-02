import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1,
    bacon: 0.6
}
class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 5,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount () {
        axios.get('https://burger-builder-backend-75b01.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({
                    ingredients: response.data
                });
            }).catch(error => {
                this.setState({error: true});
            });
    }

    updatePurchaseHandler = (ingredients) => {
        const ing = {
            ...ingredients
        };

        const sum = Object.keys(ing).map(igkey => {
            return ing[igkey]
        }).reduce((sum, el) => {
            return sum + el;
        }, 0);
        this.setState({
            purchasable: sum > 0
        });
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const updatedTotalPrice = this.state.totalPrice + priceAddition
        this.setState({
            ingredients: updatedIngredients,
            totalPrice: updatedTotalPrice
        });

        this.updatePurchaseHandler(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }
        const updateCount = oldCount - 1;

        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updateCount;
        const updatedTotalPrice = this.state.totalPrice - INGREDIENT_PRICES[type];
        this.setState({
            ingredients: updatedIngredients,
            totalPrice: updatedTotalPrice
        });
        this.updatePurchaseHandler(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({
            purchasing: true
        });
        // this.state.purchasing = true;
    }

    cancelPurchaseHandler = () => {
        this.setState({
            purchasing: false
        });
    }

    continuePurchaseHandler = () => {
        //alert('continue!');
        this.setState({
            loading: true
        });
        const order = {
            ingredients: this.state.ingredients,
            //in production / realtime projects we calculate the price on the server(so that the users cannot modify the total)
            price: this.state.totalPrice,
            customer: {
                name: 'abc',
                orderNumber: '10',
                address: {
                    street: 'xyz',
                    zipcode: '00000'
                },
                email: 't@t.com'
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json', order)
            .then(response => {
                // console.log(response);
                this.setState({
                    loading: false,
                    purchasing: false
                });
            })
            .catch(error => {
                // console.log(error);
                this.setState({
                    loading: false,
                    purchasing: false
                });
            });
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for (let k in disabledInfo) {
            disabledInfo[k] = disabledInfo[k] <= 0

        }

        // let ordersummary = null;

        let modalContent = null;


        let burger = this.state.error ? <p> ingredients cannot be loaded</p> : <Spinner />
        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                        more={this.addIngredientHandler}
                        less={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        purchaseHandler={this.purchaseHandler}
                        purchasable={this.state.purchasable}
                        totalPrice={this.state.totalPrice} />
                </Aux>
            )
            
            modalContent = <OrderSummary
                cancel={this.cancelPurchaseHandler}
                ingredients={this.state.ingredients}
                continue={this.continuePurchaseHandler}
                totalPrice={this.state.totalPrice} />
        }

        if (this.state.loading) {
            modalContent = <Spinner />
        }

        return (
            <Aux>
                <Modal modalClosed={this.cancelPurchaseHandler} show={this.state.purchasing}>
                    {modalContent}
                </Modal >
                {burger}
            </Aux>
        );
    }

}

export default withErrorHandler(BurgerBuilder, axios);