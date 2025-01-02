import { useEffect, useState } from 'react';
import { Button, Card, Text } from 'react-native-paper';
import {StyleSheet, Image, View} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import ottoData from '../ottoData.json';

interface OttoData {
    katuosoite: string,
    postinumero: string,
    postitoimipaikka: string,
    koordinaatti_LAT: number,
    koordinaatti_LON: number,
}

interface OttoDataWithDistance {
    katuosoite: string,
    postinumero: string,
    postitoimipaikka: string,
    distance: number,
}

const OttoLocator : React.FC = () : React.ReactElement =>  {

    //https://docs.expo.dev/versions/latest/sdk/location/#usage

    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [closestOtto, setClosestOtto] = useState<OttoDataWithDistance | null>(null);

    const ottoList : OttoData[] = ottoData;

    useEffect(() => {
        
        const getCurrentLocation = async () : Promise<void> => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            setErrorMsg(null);
            let location : Location.LocationObject = await Location.getCurrentPositionAsync({});
            setLocation(location);
        }

        getCurrentLocation();
    }, []);

    //https://www.geeksforgeeks.org/haversine-formula-to-find-distance-between-two-points-on-a-sphere/

    const findClosestOtto = async () : Promise<void> => {
        if (location !== null) {

            const closestOttoArray : OttoDataWithDistance[]= [];

            for (var i = 0; i < ottoList.length; i++) {

                let distanceLat : number = (ottoList[i].koordinaatti_LAT - location.coords.latitude) * Math.PI / 180;
                let distanceLon : number = (ottoList[i].koordinaatti_LON - location.coords.longitude) * Math.PI / 180;

                let lat1 : number = location.coords.latitude * Math.PI / 180;
                let lat2 : number = ottoList[i].koordinaatti_LAT * Math.PI / 180;

                let a : number = Math.pow(Math.sin(distanceLat / 2), 2) 
                                + Math.pow(Math.sin(distanceLon / 2), 2) 
                                * Math.cos(lat1) * Math.cos(lat2);
                let c : number = 2 * Math.asin(Math.sqrt(a));
                let rad : number = 6371;
                let distance : number = rad * c;

                closestOttoArray.push({
                    katuosoite : ottoList[i].katuosoite,
                    postinumero : ottoList[i].postinumero,
                    postitoimipaikka : ottoList[i].postitoimipaikka,
                    distance : distance
                });

            }
            closestOttoArray.sort((a, b) => a.distance - b.distance)
            setClosestOtto(closestOttoArray[0]);
            setErrorMsg(null);
        } else {
            setErrorMsg('Location not available');
        }
    }

    return (
        <SafeAreaProvider>
            
            <SafeAreaView style={styles.baseline}>
                <Text variant="headlineSmall" style={styles.title}>Otto Locator</Text>
                
                <View style={styles.imageContainer}>
                   <Image source={require('../assets/undraw_Savings_re_eq4w.png')} style={styles.image} resizeMode='contain'/>
                </View>
    
                <Button 
                    mode="contained" 
                    style={{width: '90%', marginTop: 10, marginBottom: 10}} 
                    onPress={() => findClosestOtto()}
                >
                    Find Closest Otto
                </Button>

                    {Boolean(closestOtto) 
                    ? (<Card mode='contained' style={{width: '90%'}}>
                        <Card.Content>
                            <Text variant="titleMedium">Closest Otto</Text>
                            <Text variant='bodyMedium'>{closestOtto?.katuosoite}, </Text>
                            <Text variant='bodyMedium'>{closestOtto?.postinumero} {closestOtto?.postitoimipaikka}</Text>
                            <Text variant='bodyMedium'>Distance {(closestOtto?.distance)?.toFixed(2)} km</Text>
                        </Card.Content>
                    </Card>) 
                    : Boolean(errorMsg) 
                        ? (<Text style={styles.paragraph}>{errorMsg}</Text>) 
                        : null
                    }

            </SafeAreaView>
        </SafeAreaProvider>
    )
};

const styles = StyleSheet.create({
    baseline: {
        flex: 1,
        margin: 10,
        alignItems: 'center', 
        justifyContent: 'flex-start', 
      },
      title: {
        marginBottom: 10,
        textAlign: 'center',
      },
      imageContainer: {
        height: '40%', 
        width: '100%', 
        alignItems: 'center', 
        justifyContent: 'center', 
      },
      image: {
        height: '100%', 
        width: '80%', 
      },
      paragraph: {
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 10,
      },
  });

export default OttoLocator;