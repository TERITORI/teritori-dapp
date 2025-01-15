use starknet::ContractAddress;

use snforge_std::{declare, ContractClassTrait, DeclareResultTrait};

use todo_list::ITodoListSafeDispatcher;
use todo_list::ITodoListSafeDispatcherTrait;
use todo_list::ITodoListDispatcher;
use todo_list::ITodoListDispatcherTrait;

fn deploy_contract(name: ByteArray) -> ContractAddress {
    let contract = declare(name).unwrap().contract_class();
    let (contract_address, _) = contract.deploy(@ArrayTrait::new()).unwrap();
    contract_address
}

#[test]
fn test_add_todo() {
    let contract_address = deploy_contract("TodoList");

    let dispatcher = ITodoListDispatcher { contract_address };

    dispatcher.add_todo('Do Teritori task');

    let todo = dispatcher.get_todos().at(0);
    assert(todo.title.clone() == 'Do Teritori task', 'Invalid todo title');
    assert(todo.done.clone() == false, 'Todo is not done');
}

#[test]
fn test_set_todo_done() {
    let contract_address = deploy_contract("TodoList");

    let dispatcher = ITodoListDispatcher { contract_address };

    dispatcher.add_todo('Do Teritori task');
    dispatcher.set_todo_done(0);

    let todo = dispatcher.get_todos().at(0);
    assert(todo.title.clone() == 'Do Teritori task', 'Invalid todo title');
    assert(todo.done.clone() == true, 'Todo must be done');
}

#[test]
#[feature("safe_dispatcher")]
fn test_cannot_set_todo_done_with_invalid_index() {
    let contract_address = deploy_contract("TodoList");

    let safe_dispatcher = ITodoListSafeDispatcher { contract_address };

    safe_dispatcher.add_todo('Do Teritori task').unwrap();

    // TODO: Fix this test
    // match safe_dispatcher.set_todo_done(2) {
    //     Result::Ok(_) => core::panic_with_felt252('Should have panicked'),
    //     Result::Err(panic_data) => {
    //         assert(*panic_data.at(0) == 'Index out of bounds', *panic_data.at(0));
    //     },
    // };
}
