use std::collections::HashMap;


//connection
pub enum  ConnectionType {
    Exec,
    Int,
}

pub struct Connection {
    ctype: ConnectionType, 
    is_output: bool,
    target_name: String,
    target_index: usize,
}

impl Connection {
    pub fn new( _type:ConnectionType, is_output: bool) -> Self {
        Self {
            ctype: _type, 
            is_output: is_output,
            target_name: "".to_string(),
            target_index: usize::MAX,
        }
    }

    pub fn connect_to(&mut self, target_name: String, index: usize){
        self.target_name = target_name;
        self.target_index = index;
    }

    pub fn get(&self) -> (String, usize) {
        return (self.target_name.clone(), self.target_index.clone());
    }
}

//node
enum NodeType{
    Start,
    Control,
    Variable,
    
}

pub struct Node {
    name: String,
    input: Vec<Connection>,
    output: Vec<Connection>,
}

impl Node {
    pub fn new(name: &str) -> Self {
        Self {name: name.to_string(), input: vec![], output: vec![]}
    }

    pub fn connection_add(&mut self, is_output: bool, _type:ConnectionType){
        let new_connection = Connection::new(_type, is_output);
        if is_output{
            self.output.push(new_connection);
            return;
        }
        self.input.push(new_connection);
    }

    pub fn execute_task(&self){
        println!("{}", self.name);
    }

}

//NodeList
pub struct NodeList<'l> {
    list: HashMap<String, &'l Node>,
}

impl<'l> NodeList<'l> {

    pub fn new() -> Self{
        Self {list: HashMap::new()}
    }

    pub fn add(&mut self, name: String, node: &'l Node){
        self.list.insert(name, node);
    }

    pub fn get(&self, name: String)-> &'l Node{
        return self.list.get(&name).unwrap();
    }
}


//Token
pub struct Token {
    node_name: String,
    node_index: usize,
    is_output: bool,
    
}

impl Token {

    pub fn new(name: &str) -> Self{
        Self {
            node_name: name.to_string(),
            node_index: 0,
            is_output: true,
        }
    }

    pub fn traverse(&mut self, list: & NodeList){
        if self.node_name == "".to_string() {return}

        

       
        //output to input
        let name = self.node_name.clone();
        if self.is_output {
            let index = self.node_index.clone();
            let new_node_target = list.get(name);
            self.node_name = new_node_target.output[index].get().0;
            if self.node_name == "".to_string() {return}
            println!("Going to Next Node");
            self.is_output = false;
            return;
        }
        //input to output
        println!("Execute");
        list.get(name).execute_task();
        self.is_output = true;
    }
}

//Scheduler
pub struct Scheduler<'s> {
    list: &'s NodeList<'s>,
    tokens: Vec<Token>,
}

impl<'s> Scheduler<'s> {

    pub fn new(list: &'s NodeList<'s>)-> Self {
        Self {
            list: list,
            tokens: vec![Token::new("node_start")],
        }
    }

    pub fn add(&mut self, name: &str){
        &tokens.push(Token::new(name));
    }

    pub fn looping(&mut self){
        while !self.are_tokens_finished() {
            for t in &mut self.tokens{
                t.traverse(self.list);
            }
        }
    }

    pub fn are_tokens_finished(&self)->bool{
        for t in self.tokens.iter(){
            if t.node_name != "".to_string() {return false}
        }    
        return true
    }
}

pub struct Frame<'f> {
    scheduler: &'f Scheduler<'f>
}

impl<'f> Frame<'f> {
    pub fn new(list: &'f NodeList<'f>)-> Self {
        Self {
            scheduler: Scheduler::new(list),
        }
    }

    pub fn init(&mut self){
        &self.scheduler.looping();
    }

    pub fn fork(&mut self){
        &self.scheduler.add("node_fork");
    }

}


//main

fn main() {



    //Node Library
    //Event Start
    let mut node_start = Node::new("node_start");
    node_start.connection_add(true, ConnectionType::Exec);

    //Fork
    let mut node_fork = Node::new("node_fork");
    node_fork.connection_add(false, ConnectionType::Exec);
    node_fork.connection_add(true, ConnectionType::Exec);
    node_fork.connection_add(true, ConnectionType::Exec);

    //Set X Var
    let mut var_x_set = Node::new("var_x_set");
    var_x_set.connection_add(false, ConnectionType::Exec);
    var_x_set.connection_add(false, ConnectionType::Int);
    var_x_set.connection_add(true, ConnectionType::Exec);
    var_x_set.connection_add(true, ConnectionType::Int);

    //Get X Var
    let mut var_x_get = Node::new("var_x_get");
    var_x_get.connection_add(true, ConnectionType::Int);

    //Get Manual Value
    let mut int_get = Node::new("int_get");
    int_get.connection_add(true, ConnectionType::Int);

    //Add Int
    let mut node_add_int = Node::new("node_add_int");
    node_add_int.connection_add(false, ConnectionType::Int);
    node_add_int.connection_add(false, ConnectionType::Int);
    node_add_int.connection_add(true, ConnectionType::Int);

    //Print Int
    let mut node_print_int = Node::new("node_print_int");
    node_print_int.connection_add(false, ConnectionType::Exec);
    node_print_int.connection_add(false, ConnectionType::Int);
    node_print_int.connection_add(true, ConnectionType::Exec);


    //connect
    node_start.output[0].connect_to(node_fork.name.clone(), 0);    //Start -> Fork
    node_fork.output[0].connect_to(var_x_set.name.clone(), 0);       //Fork -> Set
    var_x_set.output[0].connect_to(node_print_int.name.clone(), 0);  //Set -> Print
    var_x_set.output[1].connect_to(node_print_int.name.clone(), 1);  //Set Val -> Print val

    //add connection to set x
    var_x_get.output[0].connect_to(node_add_int.name.clone(), 0);
    int_get.output[0].connect_to(node_add_int.name.clone(), 1);
    node_add_int.output[0].connect_to(var_x_set.name.clone(), 1);

    //Setup Node List
    let mut main_list = NodeList::new();
    
    //Main Line
    main_list.add(node_start.name.clone(), &node_start);
    main_list.add(node_fork.name.clone(), &node_fork);
    main_list.add(var_x_set.name.clone(), &var_x_set);
    main_list.add(node_print_int.name.clone(), &node_print_int);

    //set X input evaluation
    //main_list.add(node_int_add);
    //main_list.add(var_x_get);
    //main_list.add(node_val_int);

    

    //create Token
    let mut scheduler = Scheduler::new(&main_list);
    scheduler.looping();
}
