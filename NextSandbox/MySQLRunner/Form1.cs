using System;
using System.Configuration;
using System.Data.SqlClient;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using Microsoft.SqlServer.Management.Common;//Microsoft.SqlServer.ConnectionInfo.dll
using Microsoft.SqlServer.Management.Smo;

namespace MySQLRunner
{
    public partial class Form1 : Form
    {
        #region Attributs/Constantes ----------------------------------------------------------------------------
        private StringBuilder _sbSortie = new StringBuilder("");
        private const string _strSeparateur = @"----------------------------------------------------------------------------";
        private const string _strSeparateur1 = @"/*************************************************************************************************/";
        private const string _strTitle = @"/*{0}*/";
        #endregion

        #region Evenementiel -------------------------------------------------------------------------

        /// <summary>
        /// Initializes a new instance of the <see cref="Form1"/> class.
        /// </summary>
        public Form1()
        {
            InitializeComponent();

            // Remplissage de la liste des connections
            FillConnectionListe();

            // Remplissage des listes de Filtres de connections : Plateforme/Pays
            FillConnectionFilters();

            var RootDirectory = ConfigurationManager.AppSettings["RootDirectory"];
            if (String.IsNullOrEmpty(RootDirectory)) RootDirectory = Environment.CurrentDirectory;
            txtSqlFileDirectory.Text = RootDirectory;
            String version = ConfigurationManager.AppSettings["VersionAttendue"];
            if (!String.IsNullOrEmpty(version)) txtVersion.Text = version;
        }

        /// <summary>
        /// Handles the Load event of the Form1 control.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        private void Form1_Load(object sender, System.EventArgs e)
        {
        }

        #region Buttons Click

        /// <summary>
        /// Handles the Click event of the button1 control.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        private void button1_Click(object sender, EventArgs e)
        {

            FolderBrowserDialog FolderBrowserDialog1 = new FolderBrowserDialog();
            if (!string.IsNullOrEmpty(txtSqlFileDirectory.Text))
            {
                FolderBrowserDialog1.SelectedPath = txtSqlFileDirectory.Text;
            }
            if (FolderBrowserDialog1.ShowDialog() == DialogResult.OK)
            {
                txtSqlFileDirectory.Text = FolderBrowserDialog1.SelectedPath;
            }
        }

        /// <summary>
        /// Handles the Click event of the btnDirectoryParser control.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        private void btnDirectoryParser_Click(object sender, EventArgs e)
        {
            txtFileFilter.Text = string.Empty;
            if (!string.IsNullOrEmpty(txtSqlFileDirectory.Text))
            {
                FillFileList(txtSqlFileDirectory.Text, string.Empty);
            }
        }


        /// <summary>
        /// Handles the Click event of the btnCheckAll control.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        private void btnCheckAll_Click(object sender, EventArgs e)
        {
            for (int i = 0; i < ClbListeFichiers.Items.Count; i++)
            {
                ClbListeFichiers.SetItemChecked(i, true);
            }
        }

        /// <summary>
        /// Handles the Click event of the btnCheckNone control.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        private void btnCheckNone_Click(object sender, EventArgs e)
        {
            for (int i = 0; i < ClbListeFichiers.Items.Count; i++)
            {
                ClbListeFichiers.SetItemChecked(i, false);
            }
        }

        /// <summary>
        /// Handles the Click event of the btnCheckAll2 control.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        private void btnCheckAll2_Click(object sender, EventArgs e)
        {
            for (int i = 0; i < ClbListeConnection.Items.Count; i++)
            {
                ClbListeConnection.SetItemChecked(i, true);
            }

        }

        /// <summary>
        /// Handles the Click event of the btnCheckNone2 control.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        private void btnCheckNone2_Click(object sender, EventArgs e)
        {
            for (int i = 0; i < ClbListeConnection.Items.Count; i++)
            {
                ClbListeConnection.SetItemChecked(i, false);
            }
        }

        /// <summary>
        /// Handles the Click event of the btnExec control.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        private void btnExec_Click(object sender, EventArgs e)
        {
            var ListeFichiers = (from string f in ClbListeFichiers.CheckedItems
                                 orderby f
                                 select f).ToList();

            var ListeConnection = from string c in ClbListeConnection.CheckedItems
                                  orderby c
                                  select new { Name = c, ConnectionString = ConfigurationManager.ConnectionStrings[c].ConnectionString };
            _sbSortie = new StringBuilder("");
            foreach (var item in ListeConnection)
            {
                try
                {
                    using (System.Data.SqlClient.SqlConnection conn = new System.Data.SqlClient.SqlConnection(item.ConnectionString))
                    {
                        conn.Open();
                        conn.InfoMessage += new SqlInfoMessageEventHandler(conn_InfoMessage);
                        Server ServerManager = new Server(new ServerConnection(conn));
                        //ServerManager.ConnectionContext.InfoMessage += new SqlInfoMessageEventHandler(conn_InfoMessage);


                        _sbSortie.AppendLine(_strSeparateur1);
                        _sbSortie.AppendFormat("{0} Connecté.{1}{1}", item.Name, Environment.NewLine);


                        foreach (String file in ListeFichiers)
                        {
                            ExecuteScript(ref ServerManager, file);
                            //_sbSortie.AppendFormat(_strTitle, file);
                            //_sbSortie.AppendLine();
                            //try
                            //{
                            //    String sqlCommandText = "";
                            //    using (TextReader tr = new StreamReader(file, Encoding.UTF8))
                            //    {
                            //        sqlCommandText = tr.ReadToEnd();
                            //        tr.Close();
                            //    }

                            //    ServerManager.ConnectionContext.ExecuteNonQuery(sqlCommandText);
                            //    _sbSortie.AppendLine("[OK]");
                            //}
                            //catch (FileNotFoundException)
                            //{
                            //    _sbSortie.AppendLine("[KO] : Fichier inexistant");

                            //}
                            //catch (Exception ex)
                            //{
                            //    _sbSortie.AppendLine("[KO] : L'execution du script a echoué.");
                            //    _sbSortie.AppendLine(ex.Message);
                            //    _sbSortie.AppendLine(ex.StackTrace);

                            //}
                            //finally
                            //{
                            //    _sbSortie.AppendLine();
                            //}
                        }
                        _sbSortie.AppendFormat("{1}{0} Déconnecté.{1}{1}", item.Name, Environment.NewLine);
                    }

                }
                catch (Exception ex)
                {
                    _sbSortie.AppendLine(_strSeparateur1);
                    _sbSortie.AppendFormat("ERREUR : La connection à la base {0} a echoué.{1}", item.Name, Environment.NewLine);
                    _sbSortie.AppendLine(ex.Message);
                    _sbSortie.AppendLine(ex.StackTrace);
                }
                finally
                {
                    _sbSortie.AppendLine();
                }
            }
            txtSortie.Text = _sbSortie.ToString();
        }

        /// <summary>
        /// Handles the Click event of the btnCheckConnections control.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        private void btnCheckConnections_Click(object sender, EventArgs e)
        {
            _sbSortie = new StringBuilder("");
            foreach (String item in ClbListeConnection.CheckedItems)
            {
                _sbSortie.AppendFormat("Connection à {0} : {1}", item, TestConnection(ConfigurationManager.ConnectionStrings[item].ConnectionString));
                _sbSortie.AppendLine();
            }
            txtSortie.Text = _sbSortie.ToString();
        }

        /// <summary>
        /// Handles the Click event of the btnShowFiles control.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        private void btnShowFiles_Click(object sender, EventArgs e)
        {
            _sbSortie = new StringBuilder("");
            foreach (String item in ClbListeFichiers.CheckedItems)
            {
                _sbSortie.AppendLine(ShowFileContent(item));
            }
            txtSortie.Text = _sbSortie.ToString();
        }

        #endregion


        /// <summary>
        /// Handles the InfoMessage event of the conn control.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="ev">The <see cref="System.Data.SqlClient.SqlInfoMessageEventArgs"/> instance containing the event data.</param>
        private void conn_InfoMessage(object sender, System.Data.SqlClient.SqlInfoMessageEventArgs ev)
        {
            foreach (SqlError err in ev.Errors)
            {
                _sbSortie.AppendLine(err.Message);
            }
        }

        #endregion


        /// <summary>
        /// Tests the connection.
        /// </summary>
        /// <param name="connString">The conn string.</param>
        /// <returns></returns>
        public bool TestConnection(String connString)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(connString))
                {
                    conn.Open();
                    conn.InfoMessage += new SqlInfoMessageEventHandler(conn_InfoMessage);
                    using (SqlCommand command = conn.CreateCommand())
                    {
                        command.CommandText = "select dbo.getDbVersion()";
                        object o = command.ExecuteScalar();
                        if (o == null || o == DBNull.Value)
                            return false;
                        string CurrentVersion = (string)o;
                        if (CurrentVersion != txtVersion.Text)
                            //_s
                            return false;
                    }
                    conn.Close();
                }
            }
            catch
            {
                return false;
            }
            return true;
        }

        /// <summary>
        /// Shows the content of the file.
        /// </summary>
        /// <param name="FileName">Name of the file.</param>
        /// <returns></returns>
        private String ShowFileContent(String FileName)
        {
            StringBuilder res = new StringBuilder("");
            try
            {
                using (TextReader tr = new StreamReader(FileName,Encoding.UTF8))
                {

                    res.AppendLine(_strSeparateur1);
                    res.AppendFormat(_strTitle, FileName);
                    res.AppendLine();
                    res.AppendLine(tr.ReadToEnd());
                    tr.Close();
                }
            }
            catch (FileNotFoundException)
            {
                res.AppendFormat("Fichier {0} inexistant", FileName);
                res.AppendLine();
            }
            return res.ToString();
        }

        /// <summary>
        /// Executes the script.
        /// </summary>
        /// <param name="ServerConn">The server conn.</param>
        /// <param name="file">The file.</param>
        private void ExecuteScript(ref Server ServerMan, String file)
        {
            _sbSortie.AppendFormat(_strTitle, file);
            _sbSortie.AppendLine();
            try
            {
                String sqlCommandText = "";
                using (TextReader tr = new StreamReader(file, Encoding.UTF8))
                {
                    sqlCommandText = tr.ReadToEnd();
                    tr.Close();
                }

                ServerMan.ConnectionContext.ExecuteNonQuery(sqlCommandText);
                _sbSortie.AppendLine("[OK]");
            }
            catch (FileNotFoundException)
            {
                _sbSortie.AppendLine("[KO] : Fichier inexistant");

            }
            catch (Exception ex)
            {
                _sbSortie.AppendLine("[KO] : L'execution du script a echoué.");
                _sbSortie.AppendLine(ex.Message);
                _sbSortie.AppendLine(ex.StackTrace);

            }
            finally
            {
                _sbSortie.AppendLine();
            }
        }

        /// <summary>
        /// Handles the InfoMessage event of the ConnectionContext control.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">The <see cref="System.Data.SqlClient.SqlInfoMessageEventArgs"/> instance containing the event data.</param>
        void ConnectionContext_InfoMessage(object sender, SqlInfoMessageEventArgs e)
        {
            foreach (SqlError err in e.Errors)
            {
                _sbSortie.AppendLine(err.Message);
            }
        }

        /// <summary>
        /// Handles the Click event of the btnFilterConnection control.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        private void btnFilterConnection_Click(object sender, EventArgs e)
        {
            FillConnectionListe((string)cbbFilterConnectionPlateforme.SelectedItem, (string)cbbFilterConnectionPays.SelectedItem);
        }

        /// <summary>
        /// Fills the connection liste.
        /// </summary>
        private void FillConnectionListe()
        {
            FillConnectionListe(string.Empty, string.Empty);
        }
        /// <summary>
        /// Fills the connection liste.
        /// </summary>
        /// <param name="plateforme">The plateforme.</param>
        /// <param name="pays">The pays.</param>
        private void FillConnectionListe(string plateforme, string pays)
        {

            Func<string, Int32, string> Component = delegate(string s, Int32 pos)
            {
                var ss = s.Split(' ');
                if (ss.Length >= pos)
                    return ss[pos].ToUpper();
                else
                    return "";
            };

            Func<string, string, string, Boolean> Fitrer = delegate(string str, string plateforme1, string pays1)
            {
                if (str.Length <= 0) return false;
                if (!string.IsNullOrEmpty(plateforme1) && !str.ToUpper().Contains(plateforme1.ToUpper())) return false;
                if (!string.IsNullOrEmpty(pays1) && !str.ToUpper().Contains(pays1.ToUpper())) return false;
                return true;
            };

            var liste = from ConnectionStringSettings connStr in ConfigurationManager.ConnectionStrings
                        where Fitrer(connStr.Name, plateforme, pays) == true
                        select connStr;

            ClbListeConnection.Items.Clear();
            foreach (var connStr in liste)
            {
                ClbListeConnection.Items.Add(connStr.Name);
            }
            ClbListeConnection.Refresh();
        }

        /// <summary>
        /// Fills the connection filters.
        /// </summary>
        private void FillConnectionFilters()
        {
            var PlateformeFilter = from line in ConfigurationManager.AppSettings["PlateformeFilter"].Split(',')
                                   select line;
            var PaysFilter = from line in ConfigurationManager.AppSettings["PaysFilter"].Split(',')
                             select line;

            cbbFilterConnectionPlateforme.DataSource = PlateformeFilter.ToList();
            cbbFilterConnectionPlateforme.Refresh();

            cbbFilterConnectionPays.DataSource = PaysFilter.ToList();
            cbbFilterConnectionPays.Refresh();
        }

        /// <summary>
        /// Fills the file list.
        /// </summary>
        /// <param name="DirectoryRoot">The directory root.</param>
        /// <param name="filtre">The filtre.</param>
        private void FillFileList(string DirectoryRoot, string filtre)
        {
            Func<string, string, Boolean> filtrer = delegate(string str, string search)
            {
                if (str.Length <= 0) return false;
                if (!string.IsNullOrEmpty(search) && !str.ToUpper().Contains(search.ToUpper())) return false;
                return true;
            };

            var files = from string file in System.IO.Directory.GetFiles(DirectoryRoot, "*.sql", System.IO.SearchOption.AllDirectories)
                        orderby file
                        where filtrer(file, filtre) == true
                        select file;
            ClbListeFichiers.Items.Clear();
            foreach (var file in files)
            {
                ClbListeFichiers.Items.Add(file);
            }

        }
        /// <summary>
        /// Handles the Click event of the btnFileFilter control.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        private void btnFileFilter_Click(object sender, EventArgs e)
        {
            if (!string.IsNullOrEmpty(txtSqlFileDirectory.Text))
            {
                FillFileList(txtSqlFileDirectory.Text, txtFileFilter.Text);
            }
        }

        /// <summary>
        /// Handles the TextChanged event of the txtSortie2 control.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        private void txtSortie2_TextChanged(object sender, EventArgs e)
        {

        }

    }

}
