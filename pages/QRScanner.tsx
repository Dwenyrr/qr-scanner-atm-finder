import { Dimensions, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { View } from 'react-native';
import { Button, FAB, Text, Icon } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { WebView } from 'react-native-webview';

interface CameraInfo {
    cameraMode: boolean,
    error: string,
}

//https://stackoverflow.com/questions/35451139/react-native-webview-not-loading-any-url-react-native-web-view-not-working
const deviceHeight : number = Dimensions.get('window').height;
const deviceWidth : number = Dimensions.get('window').width;

const QRScanner : React.FC = () : React.ReactElement =>  {

    const [cameraInfo, setCameraInfo] = useState<CameraInfo>({
                                                            cameraMode: false,
                                                            error: ""
                                                        });
    const [permission, requestPermission] = useCameraPermissions();
    const [qrData, setQrData] = useState<string>("");
    const [webViewVisible, setWebViewVisible] = useState<boolean>(false);
    const [urlError, setUrlError] = useState<string>("");
    
    const openCamera = async () : Promise<void> => {
        if (permission?.granted) {
            setCameraInfo({
                ...cameraInfo,
                cameraMode: true,
                error: "",
            })
        } else {
            requestPermission();
            setCameraInfo({
                ...cameraInfo,
                error: "No permission to access camera"
            });
        }
    };

    const closeCamera = async () : Promise<void> => {
        setCameraInfo({
            ...cameraInfo,
            cameraMode: false
        });
    }

    const clearQR = async () : Promise<void> => {
        setQrData("");
        setWebViewVisible(false);
    };

    const handleScannedQRCode = async (data : string) : Promise<void> => {
        if (data.startsWith( 'http://') || data.startsWith('https://')) {
            setQrData(data);
            setWebViewVisible(true);
            closeCamera();
            setUrlError("");
        } else {
            setUrlError("Invalid URL");
            closeCamera();
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.baseline}>
                <Text variant="headlineSmall" style={styles.title}>QR Code Scanner</Text>

                {webViewVisible
                    ? (
                        <View style={{flex: 1}}>
                            <WebView style={styles.webview} source={{ uri: qrData }}/>
                            <View style={styles.bottomCenterContainer}>
                                <FAB
                                    icon="close"
                                    onPress={clearQR}
                                    style={styles.buttonClose}
                                />
                            </View>
                        </View>
                    )
                    : (
                        <>
                            <View style={styles.imageContainer}>
                                <Icon source='qrcode' size={90} color='#9d89c2' />
                            </View>
                            <Button mode="contained" style={{width: '90%'}} onPress={openCamera}>Scan code</Button>
                            {(Boolean(cameraInfo.cameraMode))
                                ? <>
                                    <CameraView
                                        style={StyleSheet.absoluteFill}
                                        facing= 'back'
                                        barcodeScannerSettings={{barcodeTypes: ["qr"]}}
                                        onBarcodeScanned={({data}) => { handleScannedQRCode(data) }}
                                    >
                                        <View style={styles.bottomCenterContainer}>
                                            <FAB
                                                icon="close"
                                                onPress={closeCamera}
                                                style={styles.buttonClose}
                                            />
                                        </View>
                                    </CameraView>
                                </>
                                : null
                            }
                        </>
                    )
                }

                {Boolean(urlError) ? (<Text>{urlError}</Text>) : null}

                {Boolean(cameraInfo.error) ? (<Text>{cameraInfo.error}</Text>) : null}

            </SafeAreaView>
        </SafeAreaProvider>
    )
};

const styles = StyleSheet.create({
    webview: {
        flex: 1,
        width: deviceWidth,
        height: deviceHeight
      },
    baseline: {
        flex: 1,
        alignItems: 'center', 
        justifyContent: 'flex-start', 
      },
      imageContainer: {
        height: '40%', 
        width: '100%', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: -40, 
        marginTop: -40,
      },
      buttonClose : {
        borderRadius : 50,
      },
      bottomCenterContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
      },
      title: {
        marginBottom: 10,
        marginTop: 10,
        textAlign: 'center',
      },
  });

export default QRScanner;