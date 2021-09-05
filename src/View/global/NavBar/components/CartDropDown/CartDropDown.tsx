import React, { Component } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { APP_SVG } from '../../../../../constants/images'
import { CartProductsProps, CurrenciesProps } from '../../../../../Data/Models/DataModels'
import CartItemLogic from '../../../../../Logic/CartItem/CartItem.logic'
import { RootState } from '../../../../../Logic/Store/store'
import CartItem from '../../../../pages/CheckOut/components/CartItem'

interface Props extends RouteComponentProps {
    products: CartProductsProps[],
    selectedCurrency: CurrenciesProps,
}

type State = {
    dropDownClicked: boolean
}

class CartDropDown extends Component<Props, State> {
    cartLogic: CartItemLogic

    constructor(props: Props) {
        super(props);
        this.cartLogic = new CartItemLogic()
    }

    state: Readonly<State> = {
        dropDownClicked: false
    }
    clickHandler = () => {
        if (this.getWindowDimensions().width > 720)
            this.setState({ dropDownClicked: !this.state.dropDownClicked })
        else {
            this.props.history.replace('/Cart')
        }
    }

    getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }

    loadItems = () => {
        let items = [];
        let totalPrice: number | string = 0;
        for (let i = 0; i < this.props.products.length; i++) {
            let price = this.props.products[i].product.prices.filter((p => p.currency === this.props.selectedCurrency.code))[0]
            totalPrice = totalPrice + price?.amount
            let attributes = this.cartLogic.loadAttributes(this.props.products[i].product, i)
            items.push(
                <div key={String(i)} style={{ display: 'flex', flex: 1, flexDirection: 'column', width: '100%' }}>
                    <div style={{ backgroundColor: 'gray', width: '100%', height: "1px" }} />
                    <CartItem name={this.props.products[i].product.brand!}
                        subTitle={this.props.products[i].product.name}
                        price={price}
                        attributes={attributes}
                        image={this.props.products[i].product.gallery[0]}
                        index={i}
                    />
                    <div style={{ backgroundColor: 'gray', width: '100%', height: "1px" }} />
                </div>
            )
        }
        totalPrice = parseFloat(totalPrice.toString()).toFixed(2)
        return { items, totalPrice }
    }

    render() {
        let { items, totalPrice } = this.loadItems();
        return (
            <div className="dropdown-container">
                <div onClick={this.clickHandler} className="currency-dropdown-selector">
                    <APP_SVG.CART />
                    {items.length !== 0 && <div className="item-counter">{items.length}</div>}
                </div>
                {this.state.dropDownClicked &&
                    <div className="dropdown-menu">
                        {items}
                        <div className="price-text">
                            <div>{`Total = ${this.props.selectedCurrency.symbol} ${totalPrice}`}</div>
                            <button onClick={() => { this.props.history.replace('/Cart'); this.clickHandler() }} className="add-to-cart">
                                Checkout
                            </button>
                        </div>
                    </div>
                }
            </div>
        )
    }

}


const MapStateToProps = (state: RootState) => {
    return {
        selectedCurrency: state.currency.selectedCurrency,
        products: state.cartReducer,
    }
}

const CartDropDownWithRouter = withRouter(CartDropDown)

export default connect(MapStateToProps)(CartDropDownWithRouter)
