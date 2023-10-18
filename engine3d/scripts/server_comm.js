let eventSource;

function estabilishConnection(adress="localhost", credentials="{'login':'guest';'password':'guest';}"){
    eventSource = new EventSource(adress);
    if(!eventSource)return 1;
    

}