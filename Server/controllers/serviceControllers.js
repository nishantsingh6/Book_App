const Books = require("../models/Book");

exports.postBook = async (req, res) => {
    try{
     const{title, author , description, price, genre, condition, edition, image,status} = req.body;
     if(!title || !author || !description || !price || !genre || !condition || !edition || !image || !status){
        return res.status(400).json({
            success:false,
            message:"Please fill all the fields",
            error:"All fields are required",
        });
     }

     const book = await Books.create({title, author , description, price, genre, condition, edition, image,status});
        return res.status(201).json({
            success:true,
            message:'Book added successfully',
            book,
        });

    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to add book",
            error:err.message,
        });
    }
}

exports.getBooks = async(req, res) => {
    try{
       const books = await Books.find({});
       if(!books || books.length === 0){
        return res.status(404).json({
            success:false,
            message:"No Books foudnd",
            error:"No books found",
        });
    }
        return res.status(200).json({
            success:true,
            message:"Books fetched successfully",
            books,
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to fetch books",
            error:error.message,
        });
    }
}

exports.getBookByTitle = async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Please provide a title or author to search.",
      });
    }

    const books = await Books.find({
      $or: [
        { title: { $regex: title, $options: 'i' } },
        { author: { $regex: title, $options: 'i' } }
      ]
    });

    if (books.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No books found matching the search.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      books,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch books",
      error: error.message,
    });
  }
};



exports.updateBook = async (req, res) => {
    try {
        const {id} = req.params;
        const{title, author, description, price, genre, condition, edition, image,status} = req.body;
        if(!title || !author || !description || !price || !genre || !condition || !edition || !image || !status){
            return res.status(400).json({
                success:false,
                message:"Please fill all the fields",
                error:"All fields are required",
            });
         }
         const updatedBook = await Books.findByIdAndUpdate(id, {title, author, description, price, genre, condition, edition, image,status},{new:true});  //By new true, we are getting the updated book
         if(!updatedBook){
            return res.status(404).json({
                success:false,
                message:"Book not found",
                error:"Book not found",
            });
         }
            return res.status(200).json({
                success:true,
                message:"Book updated successfully",
                book:updatedBook,
            })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to update book",
            error:error.message,
        })
    }
}

exports.deleteBook = async (req, res) => {
   try {
     const {id } = req.params;
       const book = await Books.findByIdAndDelete(id);
         if(!book){
          return res.status(404).json({
                success:false,
                message:"Book not found",
                error:"Book not found",
          });
         }
            return res.status(200).json({
                success:true,
                message:"Book deleted successfully",
                book,
            });
   } catch (error) {
    return res.status(500).json({
        success:false,
        message:"Unable to delete book",
        error:error.message,
    })
   }  
}

exports.getBooksByGenre = async (req, res) => {
    try {
        const {genre} = req.params;
        const books = await Books.find({genre});
        if(!books || books.length === 0){
            return res.status(404).json({
                success:false,
                message:"No Books available in this genre",
                error:"No books found",
            });
        }
        return res.status(200).json({
            success:true,
            message:"Books fetched successfully by genre",
            books,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to fetch books",
            error:error.message,
        })
    }
}




