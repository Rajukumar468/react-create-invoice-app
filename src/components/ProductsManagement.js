import React from 'react';
import $ from 'jquery'; 
//import select2 from 'react-select2'; 
import Header from './Header';
//import {Row, Col, Input, Button, Icon} from 'react-materialize'
import {Row, Col, Input, Button} from 'react-bootstrap';
import axios from 'axios';
function Options(){
    return(
    "HEY"
    )
}
export default class ProductsManagement extends React.Component {
    constructor(){
        super();
        this.state = {
            inputList: [],
            categories:[
                {"id":1, "name":"Chicken","products":[{"id":3, "name":"Live Chicken","rate":0},{"id":4, "name":"Cooked Chicken","rate":5},{"id":5, "name":"Freez Chicken","rate":12}]},
                {"id":2, "name":"Goats","products":[{"id":6, "name":"Live Goats","rate":0},{"id":7, "name":"Cooked Goats","rate":12},{"id":8, "name":"Fry Goats","rate":18}]}
            ],
            productList:[
                {"id":3, "name":"Live Chicken","rate":0},
                {"id":4, "name":"Cooked Chicken","rate":5},
                {"id":5, "name":"Freez Chicken","rate":12},
                {"id":6, "name":"Live Goats","rate":0},
                {"id":7, "name":"Cooked Goats","rate":12},
                {"id":8, "name":"Fry Goats","rate":18}
            ],
            products:[
                {"id":3, "name":"Live Chicken","rate":0,"price":'',"totalTax":'',"total":''},
            ],
            subTotal:0,
            subTotalRoundup:0,
            selectedProducts:[],
            
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        //this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }
    addNewRow(i,event){
        let count = this.state.products.length;
        if(count == i+1){
            this.onAddBtnClick(event);
        }
    }
    componentDidMount(event){
        this.refs.pro0.focus();
    }


    onAddBtnClick(event){
        let newProducts = {"id":"", "name":"","rate":18,"price":'',"totalTax":'',"total":''};
        let products = this.state.products;
        products.push(newProducts);
        this.setState({products:products});
    }
    
    handleChangeProducts(i,event){
        let row = this.state.products;
        let productList = this.state.productList;
        
        for(var j=0;j<=6;j++){
            if(productList[j].name == event.target.value){
                row[i].id = productList[j].id;
                row[i].name = productList[j].name;
                row[i].rate = productList[j].rate;
                this.setState({products:row});
                break;
            }
        }
        
        let newRow = this.state.products;
        if(newRow[i].price != ''){
            let pri = (parseFloat(newRow[i].price)*newRow[i].rate)/100;
            newRow[i].totalTax = pri;
            newRow[i].total = pri+(parseFloat(newRow[i].price));
            this.setState({products:newRow});
        }
        this.updateSubtotal();
    }
    
    updateSubtotal(){
        let total=0;
        for(var i=0;i<this.state.products.length;i++){
            if(this.state.products[i].total != ""){
                total = parseFloat(parseFloat(total) + parseFloat(this.state.products[i].total));
            }
        }
        this.setState({subTotal:total.toFixed(2)});
        let roundUP = Math.round(total);
        this.setState({subTotalRoundup:roundUP});
    }
    
    updatePrice(i,rate,event){
        let row = this.state.products;
        let per = (parseFloat(event.target.value)*rate)/100;
        row[i].price = event.target.value;
        row[i].totalTax = ((parseFloat(event.target.value)*rate)/100).toFixed(2);
        row[i].total = (per+(parseFloat(event.target.value))).toFixed(2);
        this.setState({products:row});
        
        this.updateSubtotal();
    }
    
    removeProducts(i,event){
        let row = this.state.products;
        row.splice(i,1);
        this.setState({products:row});
        this.updateSubtotal();
    }
    
  render(){
        return(
            
            <div className="row">
                <Header title="CREATE INVOICE"/>
                
                        <div className="panel panel-default">
                        <div className="row border">
                            <div className="panel-heading col-md-1">Action</div>
                            <div className="panel-heading col-md-1">SL</div>
                            <div className="panel-heading col-md-3">Products</div>
                            <div className="panel-heading col-md-1 text-right">TAX (%)</div>
                            <div className="panel-heading col-md-2 text-right">PRICE</div>
                            <div className="panel-heading col-md-2 text-right">TAX ON PRICE ($)</div>
                            <div className="panel-heading col-md-2 text-right">TOTAL PRODUCT PRICE ($)</div>
                        </div>
                        <div className="panel-body" id="rowList">
                            {this.state.products.map(function(item, i){
                                return(
                                    <Row>
                                    <div className="col-md-1 form-group cursor-pointer red" onClick={this.removeProducts.bind(this,i)}>X</div>
                                    <div className="col-md-1 form-group" >{i+1}</div>
                                    <div className="col-md-3 form-group">
                                            <select value={item.name}  className="form-control js-example-basic-single" ref={'pro'+i} onChange={this.handleChangeProducts.bind(this,i)}>
                                            {this.state.categories.map(function(category, j){
                                                return(
                                                    <optgroup value={category.name} label={category.name}>
                                                    
                                                    {category.products.map(function(opt, j){
                                                return(
                                                     <option value={opt.name}>{opt.name}</option>
                                                     )
                                                    })}
                                                    
                                                    </optgroup>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    
                                    <div className="col-md-1 form-group text-center">{item.rate}</div>

                                    <div className="col-md-2 form-group">
                                        <input type="text" value={this.state.price} className="form-control col-md-12 text-right" id="exampleFormControlInput1" placeholder="Enter product price" autoComplete="false" onChange={this.updatePrice.bind(this,i,item.rate)} onFocus={this.addNewRow.bind(this,i)}/>
                                    </div>
                                    <div className="col-md-2 form-group text-right">{item.totalTax}</div>
                                    <div className="col-md-2 form-group text-right">{item.total}</div>
                                </Row>
                            )},this)}
                            
                        </div>
                        <div className="row panel-footer">
                            <div className="row">
                            <Button onClick={this.onAddBtnClick.bind(this)}>+ Row</Button>
                            <span className="pull-right">SubTotal = {this.state.subTotal}</span>
                            </div>
                            <div className="pull-right"><strong>Roundup SubTotal = {this.state.subTotalRoundup}</strong></div>
                        </div>
                        </div>
            </div>
        );
    }
}