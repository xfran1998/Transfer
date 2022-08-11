import { Loading } from 'notiflix/build/notiflix-loading-aio';

class LoadingPopUp {
    static show(message, type) {
        Loading.standard({
            clickToClose: false,
            svgSize: '190px',
            backgroundColor: 'rgba(0,0,0,0.8)',
        });
        
        Loading.remove(5000);
    }
}

export { LoadingPopUp }