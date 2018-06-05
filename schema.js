const axios = require('axios');
const { 
    GraphQLObjectType, //why import? we are going to create types for our queries
    GraphQLString,
    GraphQLInt, 
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql'); 
// We then import all the types we are going to use

// Customer Type
const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields:() => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        age: {type: GraphQLInt},
    })
})

/*
// Hardcoded Data
const customers = [
    {id: '1', name: 'Henry Cavill', email: 'manofsteelwasntthatbad@gmail.com', age: 35},
    {id: '2', name: 'Chris Hemsworth', email: 'pleaseforgetghostbusters2016@gmail.com', age: 34},
    {id: '3', name: 'Ryan Gosling', email: 'hotandcreepyatthesametime@hotmail.com', age: 37},
];
*/

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType', //we want to query both individual and all
    fields:{
        customer: {
            type: CustomerType,
            args:{
                id:{type:GraphQLString}
            },
            resolve(parentValue, args){
                // //here is where we resolve response. temporarily hard coded
                // for(let i = 0; i < customers.length; i++) {
                //     if(customers[i].id === args.id) {
                //         return customers[i];
                //     }
                // }
                return axios.get('http://localhost:3000/customers/' + args.id) //this returns a promise
                    .then(res => res.data);
            }
    
        },
        customers:{
            type: new GraphQLList(CustomerType),
            resolve(parentValue, args){
                return axios.get('http://localhost:3000/customers')
                    .then(res => res.data);
            }
        }

    }
    
});

//Mutation - to actually manipulate the data. Add this const to exports. Remmber: This is optional.
//If you are not going to manipulate data, all you need to export is the root query
const mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addCustomer:{
            type:CustomerType,
            args:{
                name: {type: new GraphQLNonNull(GraphQLString)}, //we want to make the fields required so wrap the variable in 'new GraphQLNonNull'
                email: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)} 
            },
            resolve(parentValue, args){
                return axios.post('http://localhost:3000/customers', {
                    name: args.name,
                    email: args.email,
                    age: args.age
                })
                .then(res => res.data);
            }
        },
        deleteCustomer:{
            type:CustomerType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLString)}, 
            },
            resolve(parentValue, args){
                return axios.delete('http://localhost:3000/customers/' + args.id) 
                .then(res => res.data);
            }
        },
        editCustomer:{
            type:CustomerType,
            args:{
                name: {type: GraphQLString}, //we want to make the fields required so wrap the variable in 'new GraphQLNonNull'
                email: {type: GraphQLString},
                age: {type: GraphQLInt}, 
                id: {type: new GraphQLNonNull(GraphQLString)}, 

            },
            resolve(parentValue, args){
                return axios.patch('http://localhost:3000/customers/' + args.id, args)
                .then(res => res.data);
            }
        },
    }
});

module.exports = new GraphQLSchema({
    //this needs to take in a root query which is the baseline for all other queries
    query: RootQuery,
    mutation
});

// To make it more realistic, we are using axios and json-server to practice making api requests
// If you look at the docs in graphiql, you can see the mutation and root query.
// When adding a new customer, the json-server will generate a new id for you. all you do is add 'id' when returning