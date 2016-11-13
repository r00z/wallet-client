
export default class CreateVerifyController {
    constructor($scope, $state, sdk, $ionicHistory, $stateParams) {
        let publicKey;
        let publicAddress;

        if (!sdk.isUnlocked() && $state.current.name != 'initStorage') {
                console.log('not initiated. heading back to set password.');
		$state.go('initStorage');
		return;
        }

	if ($stateParams.privKey) {
	   publicKey = sdk.privateToPublic($stateParams.privKey);
	} else {
           publicKey = sdk.storeNewKey();
        }
        $scope.publicAddress = '0x'+sdk.pubToAddress(publicKey).toString('hex');
        
        $scope.tab = 'ACCOUNT_CREATED'
        $scope.recoveryPhrase =
            'six cause school board office tattoo ' +
            'mammal pulp inside cloud nurse ' +
            'absorb aspect elephant tornado';


        $scope.showVerifyMobile = () => {
            console.log('Open mobile ID');
            $scope.tab = 'VERIFY_MOBILE'
        };

        $scope.showVerifyCard = () => {
            console.log('Opening card tab');
            $scope.tab = 'VERIFY_CARD'
        };

        $scope.showVerifyBank = () => {
            console.log('Opening bank tab');
            $scope.tab = 'VERIFY_BANK'
        };

        $scope.mobileId = {};
        $scope.idNumber = null;
        $scope.verifyMobileId = () => {
            if($scope.mobileId.phoneNumber){
                console.log('phoneNumber: ' + $scope.mobileId.phoneNumber);

                //00000766 - test phone number
		console.log('submitting addr: ' + sdk.pubToAddress(publicKey).toString('hex'));
                sdk.approveWithEstonianMobileId(sdk.pubToAddress(publicKey).toString('hex') ,$scope.mobileId.phoneNumber,
                    (data) => {
                       $scope.mobileIdChallengeCode = data.mobileIdChallengeCode;
                       $scope.processing = true;
                       console.log('mobileIdChallengeCode', data.mobileIdChallengeCode)
                       $scope.$apply();
                    }
                ).then((ownerId) => {
                    $scope.processing = false;
                    $scope.idNumber = ownerId;
                    console.log("approve estonia mobile id had a response: " + ownerId);
		    sdk.storeEstonianIdCode(ownerId);
                    $scope.tab = 'USE';
                    console.log("tab: "+$scope.tab);
                    $scope.$apply();
                })

            } else {
                console.log('no phone number given...');
            }
        };

        $scope.verifyCard = () => {
            console.log('verify by card');
            $scope.processing = true;
	    //TODO: change account-identity server call to accept '0x' in hex
            sdk.approveWithEstonianIdCard($scope.publicAddress.slice(2)).then( (ownerId) => {
              console.log("id  returned: ",ownerId); 
              $scope.processing = true;
       	      sdk.storeEstonianIdCode(ownerId);
              $scope.tab = 'USE';
              $scope.$apply();
            });
        };

        $scope.verifyBank = () => {
            console.log('verify by bank transfer');
            sdk.approveWithEstonianBankTransfer($scope.publicAddress);
            $scope.tab = 'USE';
        };
        $scope.showStart = () => {
            console.log('heading back');
            $scope.tab = 'ACCOUNT_CREATED';
        }

        $scope.finish = () => {
            console.log('finish');
            $state.go('navBar.transactions');
            $scope.tab = 'ACCOUNT_CREATED';
        };
    }
}

CreateVerifyController.$inject = ['$scope', '$state', 'sdk','$ionicHistory','$stateParams'];
