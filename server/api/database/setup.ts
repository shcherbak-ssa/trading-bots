import mongoose from 'mongoose';


export function setupDatabase(): void {
  mongoose.set('autoIndex', false);

  mongoose.plugin((schema) => {
    schema.set('toObject', {
      getters: true,
      versionKey: false,
      transform(doc, ret, options) {
        delete ret._id;
      },
    });
  });
}
