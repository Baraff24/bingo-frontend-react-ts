import React from 'react';
import {BingoCardsList, Footer, Header} from './components';

const App: React.FC = () => {
    return (
        <>
            <Header />
            <BingoCardsList />
            <Footer />
        </>
    );
};

export default App;