<!-- omit in toc -->
# **Ticket Buckets**

This PoC app shows how to aggregate tickets by rules, and then into buckets of either days or weeks, for a given time range.

- [**Usage**](#usage)
  - [**Pre-requistes**](#pre-requistes)
  - [**Make sure to install**](#make-sure-to-install)
  - [**Starting the API server**](#starting-the-api-server)
- [**Further Discussion**](#further-discussion)
  - [**Performance**](#performance)

## **Usage**

### **Pre-requistes**

1. Make sure to have MongoDB running

2. Create a DB named **`cardinal-ops`**

3. Load the **`rules.json`** file into a new collection named **`rules`**
4. Load the **`tickets.json`** file into a new collection named **`tickets`**

5. Create an index in the **`tickets`** collection for the **`creation_time`** field
6. Create an index in the **`rules`** collection for the **`id`** field

7. Update the **`.env`** file with any relevant changes (like MONGODB_URI, or PORT etc)

### **Make sure to install**

```shell
npm install
```

### **Starting the API server**

```shell
npm start
```

### <!-- omit in toc -->

The API accepts 3 parameters:

- **`start_timestamp`**  
  In milliseconds, the timestamp for the start of the lookup range  

- **`end_timestamp`**  
  In milliseconds, the timestamp for the end of the lookup range

- **`bucket_size`**  
  A string that represents the sampling resolution. Can be either "day" or "week"

<!-- omit in toc -->
#### **Example**

```shell
curl http://localhost:3000/api/?start_timestamp=1547692904836&end_timestamp=1587830708495&bucket_size=week
```

## **Further Discussion**

### **Performance**

1. For the full range of sample data, it takes about:
   1. 300ms to produce the **weeks** buckets
   2. 1.5sec to produce the **days** buckets

2. Bucket calculation is done by leveraging the MongoDB Aggregation Framework. The aggregation strategy is detailed in the comments for the **`/lib/tickets-api/repository.js`** file.

3. Further optimizations can be made in a real-world production environment by:

   1. Adding pagination to the API

   2. The current API support bucketing from any timestamp within a 24h day. If we can limit the sample boundaries to the beginning or end of specific time resolutions (day / hour / minute) - we can pre-calculate the buckets as data comes in (instead of "on-demand" as we do now). This will also allow us to incrementally append more data to the buckets, and will also allow us to support sharding.

   3. The current implementation flattens the data on each request, as well as "joins" the "tickets" with the "rules" collections to translate rule IDs to their actual names. Both these steps could be done in advance (as events flow into the system).

4. Tests were only written for the boundaries generation function. Additional tests should be added for each individual aggregation step.
