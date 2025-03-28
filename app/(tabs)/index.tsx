import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { getProducts, Product } from '@/app/services/productService';  
import Header from '@/components/Header'; 
import SkeletonLoader from '@/components/SkeletonLoader'; 

const ProductsScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); 

  // Function to fetch products
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);  // Clear previous errors
    try {
      const fetchedProducts = await getProducts(); // Fetch all products
      console.log("Fetched products:", fetchedProducts); // Log fetched products for debugging
      setProducts(fetchedProducts);  // Set all products state
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch products when the component mounts
  }, []); // Empty dependency array means it will run only once

  // Handle search query input and filter products
  const handleSearch = (query: string) => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setProducts(filtered);
  };

  // Render product item
  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image 
        source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder image
        style={styles.productImage} 
      />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{`$${item.price}`}</Text>
      <Text style={styles.productDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  // If loading, show skeleton loading screen
  if (loading) {
    return (
      <View style={styles.container}>
        <Header onSearch={handleSearch} />
        <FlatList
          data={[...Array(10)]} // Simulate 10 skeleton loaders
          renderItem={() => <SkeletonLoader />}
          keyExtractor={(item, index) => String(index)}
          contentContainerStyle={styles.productList}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      </View>
    );
  }

  // If error, show error message with refresh button
  if (error) {
    return (
      <View style={styles.container}>
        <Header onSearch={handleSearch} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchProducts}>
          <Text style={styles.refreshButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Handle empty list gracefully
  if (products.length === 0) {
    return (
      <View style={styles.container}>
        <Header onSearch={handleSearch} />
        <Text style={styles.errorText}>No products found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header onSearch={handleSearch} />
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.productList}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 10,
  },
  productList: {
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: '48%',
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#333',
  },
  productDescription: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductsScreen;
