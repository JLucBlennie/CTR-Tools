import { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
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
            <View style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
                <Text style={styles.cell}>{item.id}</Text>
                <Text style={styles.cell}>{item.name}</Text>
                <Text style={styles.cell}>{item.age}</Text>
            </View>
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