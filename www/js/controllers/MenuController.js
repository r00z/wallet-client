export default class MenuController {

    constructor($scope, $state) {
        $scope.importKey = () => {
            //$state.go('eee');
        };
        $scope.transfers = () => {
            $state.go('navBar.transactions');
        };
        $scope.exportKeys = () => {
            $state.go('exportKeys');
        };
        $scope.importKey = () => {
            $state.go('importKey');
        };
        $scope.about = () => {
            $state.go('about');
        };
    }
}

MenuController.$inject = ['$scope', '$state'];
