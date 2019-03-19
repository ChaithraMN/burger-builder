import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1,
    bacon: 0.6
}
class BurgerBuilder extends Component {
    state = {
        ingredients: {
            salad: 0,
            cheese: 0,
            bacon: 0,
            meat: 0
        },
        totalPrice: 5,
        purchasable: false,
        purchasing: false
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
        alert('continue!');
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for (let k in disabledInfo) {
            disabledInfo[k] = disabledInfo[k] <= 0

        }
        return (
            <Aux>
                <Modal modalClosed={this.cancelPurchaseHandler} show={this.state.purchasing}>
                    <OrderSummary
                        cancel={this.cancelPurchaseHandler}
                        ingredients={this.state.ingredients}
                        continue={this.continuePurchaseHandler}
                        totalPrice={this.state.totalPrice} />
                </Modal >
                <Burger ingredients={this.state.ingredients} />
                {/* <div>Build Controls</div> */}
                <BuildControls
                    more={this.addIngredientHandler}
                    less={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    purchaseHandler={this.purchaseHandler}
                    purchasable={this.state.purchasable}
                    totalPrice={this.state.totalPrice} />
            </Aux>
        );
    }

}

export default BurgerBuilder;