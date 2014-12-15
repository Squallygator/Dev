using System;
using System.Text;
//Microsoft.SqlServer.ConnectionInfo.dll

namespace MySQLRunner
{
    /// <summary>
    /// SqlHelper
    /// </summary>
    public class SqlHelper
    {
        #region Privates attributes
        private StringBuilder _outputBuilder = new StringBuilder("");
        #endregion
        #region Public Properties

        /// <summary>
        /// Gets or sets the connection string.
        /// </summary>
        /// <value>The connection string.</value>
        public string ConnectionString { get; set; }

        /// <summary>
        /// Gets the output.
        /// </summary>
        /// <value>The output.</value>
        public String Output
        {
            get
            {
                return _outputBuilder.ToString();
            }
        }

        #endregion
    }
}
