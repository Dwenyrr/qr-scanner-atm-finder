import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomNavigation, Icon } from 'react-native-paper';
import { useState } from 'react';
import OttoLocator from './pages/OttoLocator';
import QRScanner from './pages/QRScanner';

interface Route {
  key: string;
  title: string;
  icon: string;
}

const App : React.FC = () : React.ReactElement =>  {

  //https://callstack.github.io/react-native-paper/3.0/bottom-navigation.html
  
  const [index, setIndex] = useState<number>(0);
  const [routes] = useState<Route[]>([
    { key: 'qrscanner', title: 'QR Scanner', icon: 'qrcode' },
    { key: 'ottolocator', title: 'Otto Locator', icon: 'map-marker' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    qrscanner: QRScanner,
    ottolocator: OttoLocator,
  });

  return (
    <SafeAreaProvider> 
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
          renderIcon={({ route, color }) => (
            <Icon source={route.icon} color={color} size={26} />
          )}
        />
    </SafeAreaProvider>
  );
}

export default App;