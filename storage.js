// storage.js
import MMKVStorage from 'react-native-mmkv-storage';

const storage = new MMKVStorage.Loader().initialize(); // Initialize the storage instance

export default storage;
