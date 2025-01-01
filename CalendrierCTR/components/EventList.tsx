import { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import * as FileSystem from 'expo-file-system';

const { width } = Dimensions.get('window');

// Données initiales
const initialData = [
    { id: '1', name: 'John Doe', age: 28 },
    { id: '2', name: 'Jane Smith', age: 34 },
    { id: '3', name: 'Sam Green', age: 23 },
];

export function EventList() {
    const [data, setData] = useState(initialData);
    const [sortColumn, setSortColumn] = useState<"id" | "name" | "age" | null>(null);
    const [isAscending, setIsAscending] = useState(true);

    readBDD();

    // Fonction pour trier les données
    function sortData(column: "id" | "name" | "age") {
        const sortedData = [...data].sort((a, b) => {
            if (a[column] < b[column]) return isAscending ? -1 : 1;
            if (a[column] > b[column]) return isAscending ? 1 : -1;
            return 0;
        });
        setData(sortedData);
        setSortColumn(column);
        setIsAscending((prev) => (sortColumn === column ? !prev : true));
    };

    function readBDD() {
        const fileUri = FileSystem.documentDirectory + 'forms.csv';
        FileSystem.downloadAsync("https://docs.google.com/spreadsheets/d/137pH1G26uQYdFMw6kWe-ms9uOHW6MLiwAjrzKOYlsw0/gviz/tq?tqx=out:csv&tq=select+*&gid=615498791", fileUri).then(
            (uriBDD) => {
                console.log("Téléchargement réussi --> " + uriBDD.uri);
                FileSystem.readAsStringAsync(uriBDD.uri).then(
                    (filecontent) => {
                        console.log("contenu du fichier : " + filecontent);
                        const rows = filecontent.split("\n").map(
                            (row) => {
                                row.split(',').map((val, index) => console.log("valeur(" + index + ") : " + val));
                            });
                    }
                ).catch(
                    (err) => {
                        console.log("Erreur lors de la lecture du fichier : " + err);
                    }
                );
            }
        ).catch(
            (err) => {
                console.log("Pb lors du téléchargement du résultat des questionnaire dans le fichier " + fileUri + "\n Erreur " + err);
            }
        );
    }

    // Ligne d'en-tête avec tri
    function renderHeader() {
        return (
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.cell} onPress={() => sortData('id')}>
                    <Text style={styles.headerText}>ID {sortColumn === 'id' && (isAscending ? '▲' : '▼')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cell} onPress={() => sortData('name')}>
                    <Text style={styles.headerText}>Nom {sortColumn === 'name' && (isAscending ? '▲' : '▼')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cell} onPress={() => sortData('age')}>
                    <Text style={styles.headerText}>Âge {sortColumn === 'age' && (isAscending ? '▲' : '▼')}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    // Ligne de données avec couleur alternée
    function renderItem({ item, index }: { item: typeof initialData[0]; index: number }) {
        return (
            <TouchableOpacity onPress={() => { console.log("Ligne numero : " + index) }}>
                <View style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
                    <Text style={styles.cell}>{item.id}</Text>
                    <Text style={styles.cell}>{item.name}</Text>
                    <Text style={styles.cell}>{item.age}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            {renderHeader()}
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        padding: 10,
        width: width
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#25292e',
        paddingVertical: 10
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 10,
    },
    evenRow: {
        backgroundColor: '#00f9f9',
    },
    oddRow: {
        backgroundColor: '#009f9f',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
    },
    headerText: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 16,
        textAlign: 'center'
    },
    list: {
        marginTop: 10,
    },
});